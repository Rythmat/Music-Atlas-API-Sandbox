import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listClassroomStudentsSchema = t.Object({
  classroomId: t.String(),
  status: t.Optional(
    t.Union([t.Literal('all'), t.Literal('active'), t.Literal('removed')]),
  ),
});

export const listClassroomStudentsResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    studentId: t.String(),
    username: t.Nullable(t.String()),
    nickname: t.String(),
    fullName: t.Nullable(t.String()),
    school: t.Nullable(t.String()),
    createdAt: t.Date(),
    removedAt: t.Optional(t.Nullable(t.Date())),
  }),
);

export async function listClassroomStudents(
  input: typeof listClassroomStudentsSchema.static,
  { database }: ContextType,
  teacherId: string,
): Promise<typeof listClassroomStudentsResponseSchema.static> {
  // Find the classroom
  const classroom = await database.classroom.findUnique({
    where: { id: input.classroomId },
  });

  if (!classroom) {
    throw error(404, 'Classroom not found');
  }

  // Check if the teacher owns this classroom
  if (classroom.teacherId !== teacherId) {
    throw error(
      403,
      'You do not have permission to view students in this classroom',
    );
  }

  // Build the where clause based on the status filter
  const where: {
    classroomId: string;
    removedAt?: { not: null } | null;
  } = {
    classroomId: input.classroomId,
  };

  if (input.status === 'active') {
    where.removedAt = null;
  } else if (input.status === 'removed') {
    where.removedAt = { not: null };
  }

  // Get the classroom students
  const classroomStudents = await database.classroomStudent.findMany({
    where,
    include: {
      Student: {
        select: {
          id: true,
          username: true,
          nickname: true,
          fullName: true,
          school: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Transform the result
  return classroomStudents.map((cs) => ({
    id: cs.id,
    studentId: cs.studentId,
    username: cs.Student.username,
    nickname: cs.Student.nickname,
    fullName: cs.Student.fullName,
    school: cs.Student.school,
    createdAt: cs.createdAt,
    removedAt: cs.removedAt,
  }));
}
