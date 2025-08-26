import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';
import { playAlongSchema } from './types';

export const deletePlayAlongSchema = t.Object({
  id: t.String(),
});

export const deletePlayAlongResponseSchema = playAlongSchema;

export async function deletePlayAlong(
  input: typeof deletePlayAlongSchema.static,
  { database, storage }: ContextType,
): Promise<typeof deletePlayAlongResponseSchema.static> {
  const playAlong = await database.playAlong.findUnique({
    where: { id: input.id },
  });

  if (!playAlong) {
    throw error(404, 'Play along not found');
  }

  if (playAlong.audioFilePath) {
    try {
      const file = storage.bucket.file(playAlong.audioFilePath);
      await file.delete();
    } catch (error) {
      console.error(error);
    }
  }

  if (playAlong.midiFilePath) {
    try {
      const file = storage.bucket.file(playAlong.midiFilePath);
      await file.delete();
    } catch (error) {
      console.error(error);
    }
  }

  return await database.playAlong.delete({
    where: { id: input.id },
  });
}
