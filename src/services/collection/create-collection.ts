import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const createCollectionSchema = t.Object({
  name: t.String(),
  description: t.Optional(t.Nullable(t.String())),
  color: t.Optional(t.String()),
  chapters: t.Optional(
    t.Array(
      t.Object({
        chapterId: t.String(),
        order: t.Number(),
      }),
    ),
  ),
});

const collectionChapterSchema = t.Object({
  id: t.String(),
  order: t.Number(),
  collectionId: t.String(),
  chapterId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const createCollectionResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  CollectionChapters: t.Array(collectionChapterSchema),
});

export async function createCollection(
  input: typeof createCollectionSchema.static,
  { database }: ContextType,
) {
  return await database.$transaction(async (tx) => {
    // Create the collection
    const collection = await tx.collection.create({
      data: {
        name: input.name,
        description: input.description,
        color: input.color,
      },
    });

    // Add chapters if provided
    if (input.chapters && input.chapters.length > 0) {
      // Create chapter relationships
      await tx.collectionChapter.createMany({
        data: input.chapters.map((chapter) => ({
          collectionId: collection.id,
          chapterId: chapter.chapterId,
          order: chapter.order,
        })),
      });
    }

    // Return the collection with chapters
    const collectionWithChapters = await tx.collection.findUnique({
      where: {
        id: collection.id,
      },
      include: {
        CollectionChapters: true,
      },
    });

    if (!collectionWithChapters) {
      throw error(404, 'Collection not found');
    }

    return collectionWithChapters;
  });
}
