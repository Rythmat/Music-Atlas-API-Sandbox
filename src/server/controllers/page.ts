import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createPage,
  createPageSchema,
  createPageResponseSchema,
} from '@/services/page/create-page';
import {
  deletePage,
  deletePageResponseSchema,
} from '@/services/page/delete-page';
import { getPage, getPageResponseSchema } from '@/services/page/get-page';
import {
  listPages,
  listPagesSchema,
  listPagesResponseSchema,
} from '@/services/page/list-pages';
import {
  reorderPages,
  reorderPagesSchema,
  reorderPagesResponseSchema,
} from '@/services/page/reorder-pages';
import {
  updatePage,
  updatePageSchema,
  updatePageResponseSchema,
} from '@/services/page/update-page';
import { contextDecorator } from '../context';

export const pageController = new Elysia({
  prefix: '/pages',
  detail: {
    tags: ['Pages'],
  },
})
  .use(contextDecorator)
  .derive(isAuthenticated);

/**
 * @description Create a new page for a chapter
 */
pageController.post(
  '',
  async ({ body, context }) => {
    return await createPage(body, context);
  },
  {
    body: createPageSchema,
    response: createPageResponseSchema,
  },
);

/**
 * @description Get a page by ID
 */
pageController.get(
  '/:id',
  async ({ params, context }) => {
    return await getPage({ id: params.id }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: getPageResponseSchema,
  },
);

/**
 * @description Update a page
 */
pageController.patch(
  '/:id',
  async ({ params, body, context }) => {
    return await updatePage({ id: params.id, ...body }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: t.Omit(updatePageSchema, ['id']),
    response: updatePageResponseSchema,
  },
);

/**
 * @description Delete a page
 */
pageController.delete(
  '/:id',
  async ({ params, context }) => {
    return await deletePage({ id: params.id }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: deletePageResponseSchema,
  },
);

/**
 * @description List all pages with pagination
 */
pageController.get(
  '',
  async ({ query, context }) => {
    return await listPages(query, context);
  },
  {
    query: listPagesSchema,
    response: listPagesResponseSchema,
  },
);

/**
 * @description Reorder pages within a chapter
 */
pageController.post(
  '/reorder',
  async ({ body, context }) => {
    return await reorderPages(body, context);
  },
  {
    body: reorderPagesSchema,
    response: reorderPagesResponseSchema,
  },
);
