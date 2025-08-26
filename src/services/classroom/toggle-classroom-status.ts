import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const toggleClassroomStatusSchema = t.Object({
  id: t.String(),
});

export const toggleClassroomStatusResponseSchema = t.Object({
  id: t.String(),
  closed: t.Boolean(),
  closedAt: t.Optional(t.Nullable(t.Date())),
});

export async function toggleClassroomStatus(
  input: typeof toggleClassroomStatusSchema.static,
  { database }: ContextType,
  teacherId: string,
): Promise<typeof toggleClassroomStatusResponseSchema.static> {
  // Find the classroom
  const classroom = await database.classroom.findUnique({
    where: { id: input.id },
  });

  if (!classroom) {
    throw error(404, 'Classroom not found');
  }

  // Check if the teacher owns this classroom
  if (classroom.teacherId !== teacherId) {
    throw error(403, 'You do not have permission to update this classroom');
  }

  // Toggle the classroom status
  const isClosed = classroom.closedAt !== null;
  const updatedClassroom = await database.classroom.update({
    where: { id: input.id },
    data: {
      closedAt: isClosed ? null : new Date(),
    },
  });

  return {
    id: updatedClassroom.id,
    closed: updatedClassroom.closedAt !== null,
    closedAt: updatedClassroom.closedAt,
  };
}
