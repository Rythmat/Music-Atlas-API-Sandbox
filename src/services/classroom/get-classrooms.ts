import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getClassroomsSchema = t.Object({
  code: t.String(),
});

export const getClassroomsResponseSchema = t.Object({
  code: t.String(),
  name: t.String(),
  year: t.Number(),
  description: t.Optional(t.Nullable(t.String())),
  teacherName: t.String(),
});

export async function getClassrooms(
  input: typeof getClassroomsSchema.static,
  { database }: ContextType,
): Promise<typeof getClassroomsResponseSchema.static> {
  const { code } = input;

  const classroom = await database.classroom.findUnique({
    where: { code },
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
    code: classroom.code,
    name: classroom.name,
    year: classroom.year,
    description: classroom.description,
    teacherName: classroom.Teacher.nickname,
  };
}
