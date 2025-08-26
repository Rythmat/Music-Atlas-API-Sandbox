import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';
import { playAlongSchema } from './types';

export const addFileToPlayAlongSchema = t.Object({
  playAlongId: t.String(),
  name: t.String(),
  color: t.Optional(t.String()),
  filePath: t.String(),
  type: t.Enum({
    audio: 'audio',
    midi: 'midi',
  }),
  beatsPerMinute: t.Optional(t.Number()),
});

export const addFileToPlayAlongResponseSchema = playAlongSchema;

export async function addFileToPlayAlong(
  input: typeof addFileToPlayAlongSchema.static,
  { database, storage }: ContextType,
): Promise<typeof addFileToPlayAlongResponseSchema.static> {
  if (input.type === 'midi' && !input.beatsPerMinute) {
    throw error(400, 'Beats per minute is required for MIDI uploads');
  }

  // Check if the file exists in the storage bucket
  const file = storage.bucket.file(input.filePath);
  const [exists] = await file.exists();

  if (!exists) {
    throw error(404, 'File not found in storage. Upload may have failed.');
  }

  await file.makePublic();

  // Set the cache control to 10 years
  await file.setMetadata({
    cacheControl: 'public, max-age=315360000, immutable',
  });

  if (input.type === 'midi') {
    return await database.playAlong.update({
      where: { id: input.playAlongId },
      data: {
        name: input.name,
        color: input.color,
        midiFilePath: file.publicUrl(),
        midiBeatsPerMinute: input.beatsPerMinute,
      },
    });
  }

  return await database.playAlong.update({
    where: { id: input.playAlongId },
    data: {
      name: input.name,
      color: input.color,
      audioFilePath: file.publicUrl(),
    },
  });
}
