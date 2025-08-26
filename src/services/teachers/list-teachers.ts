import { UserRole } from '@prisma/client';
import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listTeachersSchema = t.Object({
  status: t.Optional(
    t.Union([t.Literal('all'), t.Literal('active'), t.Literal('removed')]),
  ),
  name: t.Optional(t.String()),
  email: t.Optional(t.String()),
});

export const listTeachersResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    email: t.Nullable(t.String()),
    nickname: t.String(),
    fullName: t.Nullable(t.String()),
    school: t.Nullable(t.String()),
    createdAt: t.Date(),
    removedAt: t.Optional(t.Nullable(t.Date())),
    classroomCount: t.Number(),
  }),
);

export async function listTeachers(
  input: typeof listTeachersSchema.static,
  { database }: ContextType,
): Promise<typeof listTeachersResponseSchema.static> {
  // Build the where clause based on the status filter
  const where: {
    role: UserRole;
    removedAt?: { not: null } | null;
    OR?: Array<
      | { email: { contains: string; mode: 'insensitive' } }
      | { fullName: { contains: string; mode: 'insensitive' } }
    >;
  } = {
    role: UserRole.teacher,
  };

  if (input.status === 'active') {
    where.removedAt = null;
  } else if (input.status === 'removed') {
    where.removedAt = { not: null };
  }

  if (input.name) {
    where.OR = [
      { fullName: { contains: input.name, mode: 'insensitive' } },
      { email: { contains: input.name, mode: 'insensitive' } },
    ];
  }

  if (input.email) {
    where.OR = [
      { email: { contains: input.email, mode: 'insensitive' } },
      { fullName: { contains: input.email, mode: 'insensitive' } },
    ];
  }

  // Get the teachers with pagination
  const teachers = await database.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      nickname: true,
      fullName: true,
      school: true,
      createdAt: true,
      removedAt: true,
      _count: {
        select: {
          Classrooms: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Transform the result to include classroom count
  return teachers.map((teacher) => ({
    id: teacher.id,
    email: teacher.email,
    nickname: teacher.nickname,
    fullName: teacher.fullName,
    school: teacher.school,
    createdAt: teacher.createdAt,
    removedAt: teacher.removedAt,
    classroomCount: teacher._count.Classrooms,
  }));
}
