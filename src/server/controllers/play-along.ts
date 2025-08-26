import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  addFileToPlayAlong,
  addFileToPlayAlongResponseSchema,
  addFileToPlayAlongSchema,
} from '@/services/play-along/add-file-to-play-along';
import {
  createPlayAlong,
  createPlayAlongResponseSchema,
  createPlayAlongSchema,
} from '@/services/play-along/create-play-along';
import {
  deletePlayAlong,
  deletePlayAlongResponseSchema,
  deletePlayAlongSchema,
} from '@/services/play-along/delete-play-along';
import {
  deletePlayAlongFile,
  deletePlayAlongFileResponseSchema,
  deletePlayAlongFileSchema,
} from '@/services/play-along/delete-play-along-file';
import {
  getPlayAlong,
  getPlayAlongSchema,
  getPlayAlongResponseSchema,
} from '@/services/play-along/get-play-along';
import {
  getPlayAlongUploadUrl,
  getPlayAlongUploadUrlResponseSchema,
  getPlayAlongUploadUrlSchema,
} from '@/services/play-along/get-upload-url';
import {
  listPlayAlong,
  listPlayAlongSchema,
  listPlayAlongResponseSchema,
} from '@/services/play-along/list-play-alongs';
import {
  updatePlayAlong,
  updatePlayAlongResponseSchema,
  updatePlayAlongSchema,
} from '@/services/play-along/update-play-along';
import { contextDecorator } from '../context';

export const playAlongController = new Elysia({
  prefix: '/play-along',
  detail: {
    tags: ['Play-Along'],
  },
}).use(contextDecorator);

playAlongController.derive(isAuthenticated).get(
  '',
  async ({ query, context }) => {
    return await listPlayAlong(query, context);
  },
  {
    query: listPlayAlongSchema,
    response: listPlayAlongResponseSchema,
  },
);

playAlongController.derive(isAuthenticated).get(
  ':id',
  async ({ params, context }) => {
    return await getPlayAlong({ id: params.id }, context);
  },
  {
    params: getPlayAlongSchema,
    response: getPlayAlongResponseSchema,
  },
);

/**
 * @description Create a play-along
 */
playAlongController.derive(isAuthenticated).post(
  '',
  async ({ body, context }) => {
    return await createPlayAlong(body, context);
  },
  {
    body: createPlayAlongSchema,
    response: createPlayAlongResponseSchema,
  },
);

/**
 * @description Update an existing play-along
 */
playAlongController.derive(isAuthenticated).patch(
  ':id',
  async ({ body, params, context }) => {
    return await updatePlayAlong({ ...body, id: params.id }, context);
  },
  {
    body: t.Omit(updatePlayAlongSchema, ['id']),
    params: t.Object({
      id: t.String(),
    }),
    response: updatePlayAlongResponseSchema,
  },
);

/**
 * @description Delete a play-along
 */
playAlongController.derive(isAuthenticated).delete(
  ':id',
  async ({ params, context }) => {
    return await deletePlayAlong({ id: params.id }, context);
  },
  {
    params: deletePlayAlongSchema,
    response: deletePlayAlongResponseSchema,
  },
);

/**
 * @description Get a signed URL for uploading a file to a play-along
 */
playAlongController.derive(isAuthenticated).post(
  ':id/upload-url',
  async ({ body, params, context }) => {
    return await getPlayAlongUploadUrl(
      { ...body, playAlongId: params.id },
      context,
    );
  },
  {
    body: t.Omit(getPlayAlongUploadUrlSchema, ['playAlongId']),
    params: t.Object({
      id: t.String(),
    }),
    response: getPlayAlongUploadUrlResponseSchema,
  },
);

/**
 * @description Add a file to a play-along
 */
playAlongController.derive(isAuthenticated).post(
  ':id/files',
  async ({ body, params, context }) => {
    return await addFileToPlayAlong(
      { ...body, playAlongId: params.id },
      context,
    );
  },
  {
    body: t.Omit(addFileToPlayAlongSchema, ['playAlongId']),
    params: t.Object({
      id: t.String(),
    }),
    response: addFileToPlayAlongResponseSchema,
  },
);

/**
 * @description Delete a file from a play-along
 */
playAlongController.derive(isAuthenticated).delete(
  ':id/files',
  async ({ params, query, context }) => {
    return await deletePlayAlongFile({ ...params, type: query.type }, context);
  },
  {
    params: t.Omit(deletePlayAlongFileSchema, ['type']),
    query: t.Object({
      type: t.Union([t.Literal('midi'), t.Literal('audio')]),
    }),
    response: deletePlayAlongFileResponseSchema,
  },
);
