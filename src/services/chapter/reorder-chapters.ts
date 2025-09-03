import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const reorderChaptersSchema = t.Object({
  chapterOrders: t.Array(
    t.Object({
      id: t.String(), // chapter id
      order: t.Number(), // new order value
    }),
  ),
});

export const reorderChaptersResponseSchema = t.Object({
  success: t.Boolean(),
});

export async function reorderChapters(
  input: typeof reorderChaptersSchema.static,
  { database }: ContextType,
): Promise<typeof reorderChaptersResponseSchema.static> {
  const { chapterOrders } = input;
  const ids = chapterOrders.map((c) => c.id);

  // 1) Ensure the chapters exist
  const existing = await database.chapter.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  if (existing.length !== ids.length) {
    throw new Error('One or more chapters were not found');
  }

  // 2) Update order for every appearance of each chapter across ALL collections
  await database.$transaction(
    chapterOrders.map(({ id, order }) =>
      database.collectionChapter.updateMany({
        where: { chapterId: id },
        data: { order },
      }),
    ),
  );

  return { success: true };
}
