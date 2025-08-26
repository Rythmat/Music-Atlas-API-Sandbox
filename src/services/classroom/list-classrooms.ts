import { UserRole } from '@prisma/client';
import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listClassroomsSchema = t.Object({
  status: t.Optional(
    t.Union([t.Literal('all'), t.Literal('open'), t.Literal('closed')]),
  ),
});

export const listClassroomsResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    code: t.String(),
    name: t.String(),
    year: t.Number(),
    description: t.Optional(t.Nullable(t.String())),
    teacherId: t.String(),
    createdAt: t.Date(),
    closedAt: t.Optional(t.Nullable(t.Date())),
    studentCount: t.Number(),
  }),
);

export async function listClassrooms(
  input: typeof listClassroomsSchema.static,
  { database }: ContextType,
  userId: string,
  userRole: UserRole,
): Promise<typeof listClassroomsResponseSchema.static> {
  if (userRole === UserRole.student) {
    // Define where clause for students
    const where = {
      ClassroomStudents: {
        some: {
          studentId: userId,
        },
      },
    };

    // Get classrooms for students with pagination
    const classrooms = await database.classroom.findMany({
      where,
      orderBy: [{ year: 'desc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            ClassroomStudents: {
              where: {
                removedAt: null,
              },
            },
          },
        },
      },
    });

    // Transform the result to include student count
    return classrooms.map((classroom) => ({
      id: classroom.id,
      code: classroom.code,
      name: classroom.name,
      year: classroom.year,
      description: classroom.description,
      teacherId: classroom.teacherId,
      createdAt: classroom.createdAt,
      closedAt: classroom.closedAt,
      studentCount: classroom._count.ClassroomStudents,
    }));
  }

  // Build the where clause based on the user role and status filter
  const where: {
    teacherId?: string;
    closedAt?: { not: null } | null;
  } = {};

  // If not admin, only show classrooms for this teacher
  if (userRole !== UserRole.admin) {
    where.teacherId = userId;
  }

  // Filter by status if specified
  if (input.status === 'open') {
    where.closedAt = null;
  } else if (input.status === 'closed') {
    where.closedAt = { not: null };
  }

  // Get the classrooms with pagination
  const classrooms = await database.classroom.findMany({
    where,
    orderBy: [{ year: 'desc' }, { name: 'asc' }],
    include: {
      _count: {
        select: {
          ClassroomStudents: {
            where: {
              removedAt: null,
            },
          },
        },
      },
    },
  });

  // Transform the result to include student count
  return classrooms.map((classroom) => ({
    id: classroom.id,
    code: classroom.code,
    name: classroom.name,
    year: classroom.year,
    description: classroom.description,
    teacherId: classroom.teacherId,
    createdAt: classroom.createdAt,
    closedAt: classroom.closedAt,
    studentCount: classroom._count.ClassroomStudents,
  }));
}
