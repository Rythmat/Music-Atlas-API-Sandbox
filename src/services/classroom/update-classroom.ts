import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const updateClassroomSchema = t.Object({
  id: t.String(),
  name: t.Optional(t.String()),
  year: t.Optional(t.Number()),
  description: t.Optional(t.Nullable(t.String())),
});

export const updateClassroomResponseSchema = t.Object({
  id: t.String(),
  code: t.String(),
  name: t.String(),
  year: t.Number(),
  description: t.Nullable(t.String()),
  teacherId: t.String(),
  updatedAt: t.Date(),
});

export async function updateClassroom(
  input: typeof updateClassroomSchema.static,
  { database }: ContextType,
  teacherId: string,
): Promise<typeof updateClassroomResponseSchema.static> {
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

  // Update the classroom
  const updatedClassroom = await database.classroom.update({
    where: { id: input.id },
    data: {
      name: input.name !== undefined ? input.name : undefined,
      year: input.year !== undefined ? input.year : undefined,
      description:
        input.description !== undefined ? input.description : undefined,
    },
  });

  return {
    id: updatedClassroom.id,
    code: updatedClassroom.code,
    name: updatedClassroom.name,
    year: updatedClassroom.year,
    description: updatedClassroom.description,
    teacherId: updatedClassroom.teacherId,
    updatedAt: updatedClassroom.updatedAt,
  };
}
