import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  addMedia,
  addMediaSchema,
  addMediaResponseSchema,
} from '@/services/media/add-media';
import {
  getMediaUploadSignedUrl,
  getMediaUploadSignedUrlSchema,
  getMediaUploadSignedUrlResponseSchema,
} from '@/services/media/get-media-upload-signed-url';
import { contextDecorator } from '../context';

export const mediaController = new Elysia({
  prefix: '/media',
  detail: {
    tags: ['Media'],
  },
}).use(contextDecorator);

mediaController.derive(isAuthenticated).post(
  '/get-upload-url',
  async ({ query, context }) => {
    return await getMediaUploadSignedUrl(query, context);
  },
  {
    query: getMediaUploadSignedUrlSchema,
    response: getMediaUploadSignedUrlResponseSchema,
  },
);

mediaController.derive(isAuthenticated).post(
  '',
  async ({ body, context, session }) => {
    return await addMedia(
      {
        contentType: body.contentType,
        filePath: body.filePath,
        name: body.name,
        userId: session.id,
      },
      context,
    );
  },
  {
    body: t.Omit(addMediaSchema, ['userId']),
    response: addMediaResponseSchema,
  },
);
