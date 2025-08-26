import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getClassroomSchema = t.Object({
  id: t.String(),
});

export const getClassroomResponseSchema = t.Object({
  id: t.String(),
  code: t.String(),
  name: t.String(),
  year: t.Number(),
  description: t.Optional(t.Nullable(t.String())),
  teacherName: t.String(),
});

export async function getClassroom(
  input: typeof getClassroomSchema.static,
  { database }: ContextType,
): Promise<typeof getClassroomResponseSchema.static> {
  const { id } = input;

  const classroom = await database.classroom.findUnique({
    where: { id },
    include: {
      Teacher: true,
    },
  });

  if (!classroom) {
    throw error(404, 'Classroom not found');
  }

  if (classroom.closedAt) {
    throw error(404, 'Classroom not found');
  }

  // Transform the result to include student count
  return {
    id: classroom.id,
    code: classroom.code,
    name: classroom.name,
    year: classroom.year,
    description: classroom.description,
    teacherName: classroom.Teacher.nickname,
  };
}
