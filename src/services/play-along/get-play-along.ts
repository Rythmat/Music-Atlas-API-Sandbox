import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';
import { playAlongSchema } from './types';

export const getPlayAlongSchema = t.Object({
  id: t.String(),
});

export const getPlayAlongResponseSchema = playAlongSchema;

export async function getPlayAlong(
  input: typeof getPlayAlongSchema.static,
  { database }: ContextType,
): Promise<typeof getPlayAlongResponseSchema.static> {
  const playAlong = await database.playAlong.findUnique({
    where: { id: input.id },
  });

  if (!playAlong) {
    throw error(404, 'Play along not found');
  }

  return playAlong;
}
