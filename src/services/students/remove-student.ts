import { UserRole } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const removeStudentSchema = t.Object({
  id: t.String(),
});

export const removeStudentResponseSchema = t.Object({
  id: t.String(),
  removed: t.Boolean(),
  removedAt: t.Date(),
});

export async function removeStudent(
  input: typeof removeStudentSchema.static,
  { database }: ContextType,
): Promise<typeof removeStudentResponseSchema.static> {
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

  if (student.removedAt) {
    throw error(400, 'Student is already removed');
  }

  // Remove the student (soft delete)
  const removedAt = new Date();
  const updatedStudent = await database.user.update({
    where: { id: input.id },
    data: { removedAt },
  });

  return {
    id: updatedStudent.id,
    removed: true,
    removedAt,
  };
}
