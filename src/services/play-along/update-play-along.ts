import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const updatePlayAlongSchema = t.Object({
  id: t.String(),
  name: t.Optional(t.String()),
  description: t.Optional(t.Nullable(t.String())),
  color: t.Optional(t.Nullable(t.String())),
});

export const updatePlayAlongResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export async function updatePlayAlong(
  input: typeof updatePlayAlongSchema.static,
  { database }: ContextType,
): Promise<typeof updatePlayAlongResponseSchema.static> {
  return await database.playAlong.update({
    where: { id: input.id },
    data: {
      name: input.name,
      description: input.description,
      color: input.color,
    },
  });
}
