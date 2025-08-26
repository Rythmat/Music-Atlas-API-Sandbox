import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createChapter,
  createChapterResponseSchema,
  createChapterSchema,
} from '@/services/chapter/create-chapter';
import {
  deleteChapter,
  deleteChapterSchema,
} from '@/services/chapter/delete-chapter';
import {
  getChapter,
  getChapterResponseSchema,
  getChapterSchema,
} from '@/services/chapter/get-chapter';
import {
  listChapters,
  listChaptersResponseSchema,
  listChaptersSchema,
} from '@/services/chapter/list-chapters';
import {
  updateChapter,
  updateChapterSchema,
} from '@/services/chapter/update-chapter';
import { contextDecorator } from '../context';

export const chapterController = new Elysia({
  prefix: '/chapters',
  detail: {
    tags: ['Chapters'],
  },
}).use(contextDecorator);

chapterController.derive(isAuthenticated).get(
  '',
  async ({ query, context }) => {
    return await listChapters(query, context);
  },
  {
    query: listChaptersSchema,
    response: listChaptersResponseSchema,
  },
);

chapterController.derive(isAuthenticated).get(
  ':id',
  async ({ params, context }) => {
    return await getChapter({ id: params.id }, context);
  },
  {
    params: getChapterSchema,
    response: getChapterResponseSchema,
  },
);

/**
 * @description Create a new chapter
 */
chapterController.derive(isAuthenticated).post(
  '',
  async ({ body, context }) => {
    return await createChapter(body, context);
  },
  {
    body: createChapterSchema,
    response: createChapterResponseSchema,
  },
);

/**
 * @description Update an existing chapter
 */
chapterController.derive(isAuthenticated).patch(
  ':id',
  async ({ body, params, context }) => {
    return await updateChapter({ ...body, id: params.id }, context);
  },
  {
    body: updateChapterSchema,
    params: t.Object({
      id: t.String(),
    }),
  },
);

/**
 * @description Delete a chapter
 */
chapterController.derive(isAuthenticated).delete(
  ':id',
  async ({ params, context }) => {
    return await deleteChapter({ id: params.id }, context);
  },
  {
    params: deleteChapterSchema,
  },
);
