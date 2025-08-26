import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createCollection,
  createCollectionSchema,
  createCollectionResponseSchema,
} from '@/services/collection/create-collection';
import {
  createCollectionChapter,
  createCollectionChapterResponseSchema,
  createCollectionChapterSchema,
} from '@/services/collection/create-collection-chapter';
import {
  deleteCollection,
  deleteCollectionSchema,
  deleteCollectionResponseSchema,
} from '@/services/collection/delete-collection';
import {
  getCollectionResponseSchema,
  getCollection,
  getCollectionSchema,
} from '@/services/collection/get-collection';
import {
  listCollections,
  listCollectionsSchema,
  listCollectionsResponseSchema,
} from '@/services/collection/list-collections';
import {
  updateCollection,
  updateCollectionSchema,
  updateCollectionResponseSchema,
} from '@/services/collection/update-collection';
import { contextDecorator } from '../context';

export const collectionController = new Elysia({
  prefix: '/collections',
  detail: {
    tags: ['Collections'],
  },
}).use(contextDecorator);

/**
 * @description List all collections
 */
collectionController.derive(isAuthenticated).get(
  '',
  async ({ query, context }) => {
    return await listCollections(query, context);
  },
  {
    query: listCollectionsSchema,
    response: listCollectionsResponseSchema,
  },
);

/**
 * @description Get a collection by ID
 */
collectionController.derive(isAuthenticated).get(
  '/:id',
  async ({ params, context }) => {
    return await getCollection({ id: params.id }, context);
  },
  {
    params: getCollectionSchema,
    response: getCollectionResponseSchema,
  },
);

/**
 * @description Create a new collection chapter
 */
collectionController.derive(isAuthenticated).post(
  '/:id/chapters',
  async ({ params, body, context }) => {
    return await createCollectionChapter(
      { ...body, collectionId: params.id },
      context,
    );
  },
  {
    params: t.Object({ id: t.String() }),
    body: t.Omit(createCollectionChapterSchema, ['collectionId']),
    response: createCollectionChapterResponseSchema,
  },
);
/**
 * @description Create a new collection
 */
collectionController.derive(isAuthenticated).post(
  '',
  async ({ body, context }) => {
    return await createCollection(body, context);
  },
  {
    body: createCollectionSchema,
    response: createCollectionResponseSchema,
  },
);

/**
 * @description Update an existing collection
 */
collectionController.derive(isAuthenticated).patch(
  '/:id',
  async ({ body, params, context }) => {
    return await updateCollection({ ...body, id: params.id }, context);
  },
  {
    body: t.Omit(updateCollectionSchema, ['id']),
    params: t.Object({
      id: t.String(),
    }),
    response: updateCollectionResponseSchema,
  },
);

/**
 * @description Delete a collection
 */
collectionController.derive(isAuthenticated).delete(
  '/:id',
  async ({ params, context }) => {
    return await deleteCollection({ id: params.id }, context);
  },
  {
    params: deleteCollectionSchema,
    response: deleteCollectionResponseSchema,
  },
);
