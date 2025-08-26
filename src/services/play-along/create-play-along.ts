import { t } from 'elysia';
import type { ContextType } from '@/server/context';
import { playAlongSchema } from './types';

export const createPlayAlongSchema = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
  color: t.Optional(t.Nullable(t.String())),
});

export const createPlayAlongResponseSchema = playAlongSchema;

export async function createPlayAlong(
  input: typeof createPlayAlongSchema.static,
  { database }: ContextType,
): Promise<typeof createPlayAlongResponseSchema.static> {
  return await database.playAlong.create({
    data: {
      name: input.name,
      description: input.description,
      color: input.color,
    },
  });
}
