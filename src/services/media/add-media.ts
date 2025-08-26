import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const addMediaSchema = t.Object({
  name: t.String(),
  filePath: t.String(),
  contentType: t.String(),
  userId: t.String(),
});

export const addMediaResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  contentType: t.String(),
  filePath: t.String(),
  uploadedBy: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export async function addMedia(
  input: typeof addMediaSchema.static,
  { database, storage }: ContextType,
): Promise<typeof addMediaResponseSchema.static> {
  // Check if the file exists in the storage bucket
  const file = storage.bucket.file(input.filePath);
  const [exists] = await file.exists();

  if (!exists) {
    throw error(404, 'File not found in storage. Upload may have failed.');
  }

  await file.makePublic();

  return await database.media.create({
    data: {
      name: input.name,
      contentType: input.contentType,
      filePath: file.publicUrl(),
      uploadedBy: input.userId,
    },
  });
}
