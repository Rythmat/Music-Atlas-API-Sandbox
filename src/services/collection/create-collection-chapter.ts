import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const createCollectionChapterSchema = t.Object({
  collectionId: t.String(),
  chapterId: t.String(),
  order: t.Optional(t.Number()),
});

export const createCollectionChapterResponseSchema = t.Object({
  id: t.String(),
  collectionId: t.String(),
  chapterId: t.String(),
  order: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export async function createCollectionChapter(
  input: typeof createCollectionChapterSchema.static,
  { database }: ContextType,
): Promise<typeof createCollectionChapterResponseSchema.static> {
  return await database.$transaction(async (tx) => {
    const collectionChapter = await tx.collectionChapter.findFirst({
      where: {
        collectionId: input.collectionId,
        chapterId: input.chapterId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    return await database.collectionChapter.create({
      data: {
        collectionId: input.collectionId,
        chapterId: input.chapterId,
        order: input.order ?? (collectionChapter?.order ?? 0) + 1,
      },
    });
  });
}
