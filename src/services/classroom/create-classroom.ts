import { t } from 'elysia';
import type { ContextType } from '@/server/context';
import { generateAlphanumericCode } from '../invitation/utils';

export const createClassroomSchema = t.Object({
  name: t.String(),
  year: t.Number(),
  description: t.Optional(t.String()),
});

export const createClassroomResponseSchema = t.Object({
  id: t.String(),
  code: t.String(),
  name: t.String(),
  year: t.Number(),
  description: t.Optional(t.Nullable(t.String())),
  teacherId: t.String(),
  createdAt: t.Date(),
});

export async function createClassroom(
  input: typeof createClassroomSchema.static,
  { database }: ContextType,
  teacherId: string,
): Promise<typeof createClassroomResponseSchema.static> {
  // Generate a unique 8-character alphanumeric code
  const code = await generateAlphanumericCode(database, 'classroom');

  // Create the classroom
  const classroom = await database.classroom.create({
    data: {
      name: input.name,
      year: input.year,
      description: input.description,
      code,
      teacherId,
    },
  });

  return {
    id: classroom.id,
    code: classroom.code,
    name: classroom.name,
    year: classroom.year,
    description: classroom.description,
    teacherId: classroom.teacherId,
    createdAt: classroom.createdAt,
  };
}
