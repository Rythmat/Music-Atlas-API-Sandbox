import { UserRole } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getStudentSchema = t.Object({
  id: t.String(),
});

export const getStudentResponseSchema = t.Object({
  id: t.String(),
  email: t.Nullable(t.String()),
  username: t.Nullable(t.String()),
  nickname: t.String(),
  fullName: t.Nullable(t.String()),
  school: t.Nullable(t.String()),
  birthDate: t.Nullable(t.Date()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  removedAt: t.Nullable(t.Date()),
  classroomCount: t.Number(),
  practiceEventCount: t.Number(),
});

export async function getStudent(
  input: typeof getStudentSchema.static,
  { database }: ContextType,
): Promise<typeof getStudentResponseSchema.static> {
  // Find the student
  const student = await database.user.findUnique({
    where: {
      id: input.id,
      role: UserRole.student,
    },
    include: {
      _count: {
        select: {
          ClassroomStudents: true,
          PracticeEvents: true,
        },
      },
    },
  });

  if (!student) {
    throw error(404, 'Student not found');
  }

  return {
    id: student.id,
    email: student.email,
    username: student.username,
    nickname: student.nickname,
    fullName: student.fullName,
    school: student.school,
    birthDate: student.birthDate,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
    removedAt: student.removedAt,
    classroomCount: student._count.ClassroomStudents,
    practiceEventCount: student._count.PracticeEvents,
  };
}
