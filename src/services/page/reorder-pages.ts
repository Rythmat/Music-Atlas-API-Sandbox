import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const reorderPagesSchema = t.Object({
  chapterId: t.String(),
  pageOrders: t.Array(
    t.Object({
      id: t.String(),
      order: t.Number(),
    }),
  ),
});

export const reorderPagesResponseSchema = t.Object({
  success: t.Boolean(),
});

export async function reorderPages(
  input: typeof reorderPagesSchema.static,
  { database }: ContextType,
): Promise<typeof reorderPagesResponseSchema.static> {
  // Find the chapter
  const chapter = await database.chapter.findUnique({
    where: {
      id: input.chapterId,
    },
  });

  if (!chapter) {
    throw error(404, 'Chapter not found');
  }

  // Get all pages for the chapter
  const existingPages = await database.page.findMany({
    where: {
      chapterId: input.chapterId,
    },
    select: {
      id: true,
    },
  });

  // Create a set of existing page IDs for quick lookup
  const existingPageIds = new Set(existingPages.map((page) => page.id));

  // Validate that all page IDs in the input exist
  for (const pageOrder of input.pageOrders) {
    if (!existingPageIds.has(pageOrder.id)) {
      throw error(
        400,
        `Page with ID ${pageOrder.id} not found in this chapter`,
      );
    }
  }

  // Update the order of each page
  await Promise.all(
    input.pageOrders.map((pageOrder) =>
      database.page.update({
        where: {
          id: pageOrder.id,
        },
        data: {
          order: pageOrder.order,
        },
      }),
    ),
  );

  return {
    success: true,
  };
}
