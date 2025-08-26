import { UserRole } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const restoreStudentSchema = t.Object({
  id: t.String(),
});

export const restoreStudentResponseSchema = t.Object({
  id: t.String(),
  restored: t.Boolean(),
});

export async function restoreStudent(
  input: typeof restoreStudentSchema.static,
  { database }: ContextType,
): Promise<typeof restoreStudentResponseSchema.static> {
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

  if (!student.removedAt) {
    throw error(400, 'Student is not removed');
  }

  // Restore the student
  const updatedStudent = await database.user.update({
    where: { id: input.id },
    data: { removedAt: null },
  });

  return {
    id: updatedStudent.id,
    restored: true,
  };
}
