import { randomUUID } from 'crypto';
import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getMediaUploadSignedUrlSchema = t.Object({
  fileName: t.String(),
  contentType: t.String(),
});

export const getMediaUploadSignedUrlResponseSchema = t.Object({
  signedUrl: t.String(),
  filePath: t.String(),
});

export async function getMediaUploadSignedUrl(
  input: typeof getMediaUploadSignedUrlSchema.static,
  { storage }: ContextType,
): Promise<typeof getMediaUploadSignedUrlResponseSchema.static> {
  try {
    // Generate a unique file path for the upload
    const fileExtension = input.fileName.split('.').pop();
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;
    const filePath = `media/${uniqueFileName}`;

    // Create a file reference in the bucket
    const file = storage.bucket.file(filePath);

    // Generate a signed URL for uploading
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
      contentType: input.contentType,
    });

    return {
      signedUrl,
      filePath,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate upload URL. Please try again later.');
  }
}
