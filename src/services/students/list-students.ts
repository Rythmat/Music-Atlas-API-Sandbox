import { UserRole } from '@prisma/client';
import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listStudentsSchema = t.Object({
  status: t.Optional(
    t.Union([t.Literal('all'), t.Literal('active'), t.Literal('removed')]),
  ),
  name: t.Optional(t.String()),
  username: t.Optional(t.String()),
  classroomId: t.Optional(t.String()),
});

// Extended response schema to include classroom-specific fields when filtering by classroom
export const listStudentsResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    email: t.Nullable(t.String()),
    nickname: t.String(),
    username: t.Nullable(t.String()),
    school: t.Nullable(t.String()),
    createdAt: t.Date(),
    removedAt: t.Optional(t.Nullable(t.Date())),
    classroomCount: t.Number(),
    classroomStudentId: t.Optional(t.String()),
    joinedAt: t.Optional(t.Date()),
    removedFromClassroom: t.Optional(t.Nullable(t.Date())),
  }),
);

export async function listStudents(
  input: typeof listStudentsSchema.static,
  { database }: ContextType,
): Promise<typeof listStudentsResponseSchema.static> {
  // Build the where clause based on the status filter
  const where: {
    role: UserRole;
    removedAt?: { not: null } | null;
    OR?: Array<
      | { nickname: { contains: string; mode: 'insensitive' } }
      | { username: { contains: string; mode: 'insensitive' } }
    >;
  } = {
    role: UserRole.student,
  };

  if (input.status === 'active') {
    where.removedAt = null;
  } else if (input.status === 'removed') {
    where.removedAt = { not: null };
  }

  if (input.name) {
    where.OR = [
      { nickname: { contains: input.name, mode: 'insensitive' } },
      { username: { contains: input.name, mode: 'insensitive' } },
    ];
  }

  if (input.username) {
    where.OR = [
      { nickname: { contains: input.username, mode: 'insensitive' } },
      { username: { contains: input.username, mode: 'insensitive' } },
    ];
  }

  // Get the students with pagination
  const students = await database.user.findMany({
    where: {
      ...where,
      ClassroomStudents: input.classroomId
        ? {
            some: {
              classroomId: input.classroomId,
              ...(input.status === 'active' ? { removedAt: null } : {}),
              ...(input.status === 'removed'
                ? { removedAt: { not: null } }
                : {}),
            },
          }
        : undefined,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      username: true,
      school: true,
      createdAt: true,
      removedAt: true,
      ClassroomStudents: input.classroomId
        ? {
            where: {
              classroomId: input.classroomId,
            },
            select: {
              id: true,
              removedAt: true,
              createdAt: true,
            },
          }
        : undefined,
      _count: {
        select: {
          ClassroomStudents: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Transform the result to include classroom count and classroom-specific info
  return students.map((student) => {
    const result = {
      id: student.id,
      email: student.email,
      nickname: student.nickname,
      username: student.username,
      school: student.school,
      createdAt: student.createdAt,
      removedAt: student.removedAt,
      classroomCount: student._count.ClassroomStudents,
      classroomStudentId: undefined as string | undefined,
      joinedAt: undefined as Date | undefined,
      removedFromClassroom: undefined as Date | undefined | null,
    };

    // If filtering by classroom, add classroom-specific info
    if (
      input.classroomId &&
      student.ClassroomStudents &&
      student.ClassroomStudents.length > 0
    ) {
      const classroomStudent = student.ClassroomStudents[0];
      result.classroomStudentId = classroomStudent.id;
      result.joinedAt = classroomStudent.createdAt;
      result.removedFromClassroom = classroomStudent.removedAt ?? undefined;
    }

    return result;
  });
}
