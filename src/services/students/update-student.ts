import { UserRole } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const updateStudentSchema = t.Object({
  id: t.String(),
  nickname: t.Optional(t.String()),
  username: t.Optional(t.Nullable(t.String())),
  fullName: t.Optional(t.Nullable(t.String())),
  school: t.Optional(t.Nullable(t.String())),
  birthDate: t.Optional(t.Nullable(t.Date())),
});

export const updateStudentResponseSchema = t.Object({
  id: t.String(),
  email: t.Nullable(t.String()),
  username: t.Nullable(t.String()),
  nickname: t.String(),
  fullName: t.Nullable(t.String()),
  school: t.Nullable(t.String()),
  birthDate: t.Nullable(t.Date()),
  updatedAt: t.Date(),
});

export async function updateStudent(
  input: typeof updateStudentSchema.static,
  { database }: ContextType,
): Promise<typeof updateStudentResponseSchema.static> {
  // Find the student
  const student = await database.user.findUnique({
    where: {
      id: input.id,
      role: UserRole.student,
    },
  });

  if (!student) {
    throw error(404, 'Student not found');
  }

  // Update the student
  const updatedStudent = await database.user.update({
    where: { id: input.id },
    data: {
      nickname: input.nickname,
      username: input.username,
      fullName: input.fullName,
      school: input.school,
      birthDate: input.birthDate,
    },
  });

  return {
    id: updatedStudent.id,
    email: updatedStudent.email,
    username: updatedStudent.username,
    nickname: updatedStudent.nickname,
    fullName: updatedStudent.fullName,
    school: updatedStudent.school,
    birthDate: updatedStudent.birthDate,
    updatedAt: updatedStudent.updatedAt,
  };
}
