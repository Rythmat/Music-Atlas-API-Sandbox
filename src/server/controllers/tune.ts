import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createTune,
  createTuneResponseSchema,
  createTuneSchema,
} from '@/services/tune/create-tune';
import {
  deleteTune,
  deleteTuneResponseSchema,
  deleteTuneSchema,
} from '@/services/tune/delete-tune';
import {
  getTune,
  getTuneResponseSchema,
  getTuneSchema,
} from '@/services/tune/get-tune';
import { listTunes, listTunesResponseSchema } from '@/services/tune/list-tunes';
import {
  updateTune,
  updateTuneResponseSchema,
  updateTuneSchema,
} from '@/services/tune/update-tune';
import { contextDecorator } from '../context';

export const tuneController = new Elysia({
  prefix: '/tunes',
  detail: {
    tags: ['Tunes'],
  },
}).use(contextDecorator);

// Tune CRUD endpoints
tuneController.derive(isAuthenticated).get(
  '',
  async ({ context }) => {
    return await listTunes(undefined, context);
  },
  {
    response: listTunesResponseSchema,
  },
);

tuneController.derive(isAuthenticated).get(
  ':id',
  async ({ params, context }) => {
    return await getTune({ id: params.id }, context);
  },
  {
    params: getTuneSchema,
    response: getTuneResponseSchema,
  },
);

/**
 * @description Create a tune with measures and notes
 */
tuneController.derive(isAuthenticated).post(
  '',
  async ({ body, context }) => {
    return await createTune(body, context);
  },
  {
    body: createTuneSchema,
    response: createTuneResponseSchema,
  },
);

/**
 * @description Update an existing tune with its measures and notes
 */
tuneController.derive(isAuthenticated).patch(
  ':id',
  async ({ body, params, context }) => {
    return await updateTune({ ...body, id: params.id }, context);
  },
  {
    body: t.Omit(updateTuneSchema, ['id']),
    params: t.Object({
      id: t.String(),
    }),
    response: updateTuneResponseSchema,
  },
);

/**
 * @description Delete a tune and all its measures and notes
 */
tuneController.derive(isAuthenticated).delete(
  ':id',
  async ({ params, context }) => {
    return await deleteTune({ id: params.id }, context);
  },
  {
    params: deleteTuneSchema,
    response: deleteTuneResponseSchema,
  },
);
