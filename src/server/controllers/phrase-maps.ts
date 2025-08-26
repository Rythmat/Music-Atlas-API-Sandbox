import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createPhraseBar,
  createPhraseBarResponseSchema,
  createPhraseBarSchema,
} from '@/services/maps/create-phrase-bar';
import {
  createPhraseMap,
  createPhraseMapResponseSchema,
  createPhraseMapSchema,
} from '@/services/maps/create-phrase-map';
import { deletePhraseBar } from '@/services/maps/delete-phrase-bar';
import {
  deletePhraseMap,
  deletePhraseMapSchema,
} from '@/services/maps/delete-phrase-map';
import {
  getPhraseMap,
  getPhraseMapResponseSchema,
  getPhraseMapSchema,
} from '@/services/maps/get-phrase-map';
import {
  listPhraseMaps,
  listPhraseMapsResponseSchema,
  listPhraseMapsSchema,
} from '@/services/maps/list-phrase-maps';
import {
  updatePhraseBar,
  updatePhraseBarResponseSchema,
  updatePhraseBarSchema,
} from '@/services/maps/update-phrase-bar';
import {
  updatePhraseMap,
  updatePhraseMapSchema,
} from '@/services/maps/update-phrase-map';
import { contextDecorator } from '../context';

export const phraseMapController = new Elysia({
  prefix: '/phrase-maps',
  detail: {
    tags: ['Phrase Maps'],
  },
}).use(contextDecorator);

// List all phrase maps
phraseMapController.derive(isAuthenticated).get(
  '',
  async ({ query, context }) => {
    return await listPhraseMaps(query, context);
  },
  {
    query: listPhraseMapsSchema,
    response: listPhraseMapsResponseSchema,
  },
);

// Get a phrase map by ID
phraseMapController.derive(isAuthenticated).get(
  ':id',
  async ({ params, context }) => {
    return await getPhraseMap({ id: params.id }, context);
  },
  {
    params: getPhraseMapSchema,
    response: getPhraseMapResponseSchema,
  },
);

/**
 * @description Create a new phrase map
 */
phraseMapController.derive(isAuthenticated).post(
  '',
  async ({ body, context }) => {
    return await createPhraseMap(body, context);
  },
  {
    body: createPhraseMapSchema,
    response: createPhraseMapResponseSchema,
  },
);

/**
 * @description Update an existing chapter
 */
phraseMapController.derive(isAuthenticated).patch(
  ':id',
  async ({ body, params, context }) => {
    return await updatePhraseMap({ ...body, id: params.id }, context);
  },
  {
    body: t.Omit(updatePhraseMapSchema, ['id']),
    params: t.Object({
      id: t.String(),
    }),
  },
);

/**
 * @description Delete a phrase map
 */
phraseMapController.derive(isAuthenticated).delete(
  ':id',
  async ({ params, context }) => {
    return await deletePhraseMap({ id: params.id }, context);
  },
  {
    params: deletePhraseMapSchema,
  },
);

// Create a new phrase bar
phraseMapController.derive(isAuthenticated).post(
  ':id/bars',
  async ({ body, params, context }) => {
    return await createPhraseBar({ ...body, phraseMapId: params.id }, context);
  },
  {
    body: t.Omit(createPhraseBarSchema, ['phraseMapId']),
    params: t.Object({
      id: t.String(),
    }),
    response: createPhraseBarResponseSchema,
  },
);

// Update a phrase bar
phraseMapController.derive(isAuthenticated).patch(
  ':id/bars/:barId',
  async ({ body, params, context }) => {
    return await updatePhraseBar({ ...body, id: params.barId }, context);
  },
  {
    body: t.Omit(updatePhraseBarSchema, ['id']),
    params: t.Object({
      id: t.String(),
      barId: t.String(),
    }),
    response: updatePhraseBarResponseSchema,
  },
);

// Delete a phrase bar
phraseMapController.derive(isAuthenticated).delete(
  ':id/bars/:barId',
  async ({ params, context }) => {
    return await deletePhraseBar({ id: params.barId }, context);
  },
  {
    params: t.Object({
      id: t.String(),
      barId: t.String(),
    }),
  },
);
