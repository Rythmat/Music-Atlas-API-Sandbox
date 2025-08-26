import { UserRole } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const removeTeacherSchema = t.Object({
  id: t.String(),
});

export const removeTeacherResponseSchema = t.Object({
  id: t.String(),
  removed: t.Boolean(),
  removedAt: t.Date(),
});

export async function removeTeacher(
  input: typeof removeTeacherSchema.static,
  { database }: ContextType,
): Promise<typeof removeTeacherResponseSchema.static> {
  // Find the teacher
  const teacher = await database.user.findUnique({
    where: { id: input.id },
  });

  if (!teacher) {
    throw error(404, 'Teacher not found');
  }

  if (teacher.role !== UserRole.teacher) {
    throw error(400, 'User is not a teacher');
  }

  if (teacher.removedAt) {
    throw error(400, 'Teacher is already removed');
  }

  // Remove the teacher (soft delete)
  const removedAt = new Date();
  const updatedTeacher = await database.user.update({
    where: { id: input.id },
    data: { removedAt },
  });

  return {
    id: updatedTeacher.id,
    removed: true,
    removedAt,
  };
}
