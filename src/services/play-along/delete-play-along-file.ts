import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';
import { playAlongSchema } from './types';

export const deletePlayAlongFileSchema = t.Object({
  id: t.String(),
  type: t.Enum({
    audio: 'audio',
    midi: 'midi',
  }),
});

export const deletePlayAlongFileResponseSchema = playAlongSchema;

export async function deletePlayAlongFile(
  input: typeof deletePlayAlongFileSchema.static,
  { database, storage }: ContextType,
): Promise<typeof deletePlayAlongFileResponseSchema.static> {
  const playAlong = await database.playAlong.findUnique({
    where: { id: input.id },
  });

  if (!playAlong) {
    throw error(404, 'Play along not found');
  }

  const filePath =
    input.type === 'audio' ? playAlong.audioFilePath : playAlong.midiFilePath;

  if (!filePath) {
    throw error(404, 'File not found');
  }

  const file = storage.bucket.file(filePath);
  const [exists] = await file.exists();

  if (exists) {
    await file.delete();
  }

  if (input.type === 'audio') {
    return await database.playAlong.update({
      where: { id: input.id },
      data: { audioFilePath: null },
    });
  }

  return await database.playAlong.update({
    where: { id: input.id },
    data: { midiFilePath: null, midiBeatsPerMinute: null },
  });
}
