import { randomUUID } from 'crypto';
import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getPlayAlongUploadUrlSchema = t.Object({
  playAlongId: t.String(),
  fileName: t.String(),
  contentType: t.String(),
  type: t.Enum({
    audio: 'audio',
    midi: 'midi',
  }),
});

export const getPlayAlongUploadUrlResponseSchema = t.Object({
  signedUrl: t.String(),
  filePath: t.String(),
});

export async function getPlayAlongUploadUrl(
  input: typeof getPlayAlongUploadUrlSchema.static,
  { storage }: ContextType,
): Promise<typeof getPlayAlongUploadUrlResponseSchema.static> {
  try {
    // Generate a unique file path for the upload
    const fileExtension = input.fileName.split('.').pop();
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;
    const filePath =
      input.type === 'midi'
        ? `play-along/${input.playAlongId}/midi/${uniqueFileName}`
        : `play-along/${input.playAlongId}/audio/${uniqueFileName}`;

    // Create a file reference in the bucket
    const file = storage.bucket.file(filePath);

    // Generate a signed URL for uploading
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
      // contentType: input.contentType,
    });

    return {
      signedUrl,
      filePath, // Return the file path so it can be used to create the MIDI record later
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate upload URL. Please try again later.');
  }
}
