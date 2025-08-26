import { UserRole } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const restoreTeacherSchema = t.Object({
  id: t.String(),
});

export const restoreTeacherResponseSchema = t.Object({
  id: t.String(),
  restored: t.Boolean(),
});

export async function restoreTeacher(
  input: typeof restoreTeacherSchema.static,
  { database }: ContextType,
): Promise<typeof restoreTeacherResponseSchema.static> {
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

  if (!teacher.removedAt) {
    throw error(400, 'Teacher is not removed');
  }

  // Restore the teacher
  const updatedTeacher = await database.user.update({
    where: { id: input.id },
    data: { removedAt: null },
  });

  return {
    id: updatedTeacher.id,
    restored: true,
  };
}
