import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const updateCollectionSchema = t.Object({
  id: t.String(),
  name: t.Optional(t.String()),
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

export const updateCollectionResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  CollectionChapters: t.Array(collectionChapterSchema),
});

export async function updateCollection(
  input: typeof updateCollectionSchema.static,
  { database }: ContextType,
) {
  return await database.$transaction(async (tx) => {
    // Update the collection
    await tx.collection.update({
      where: { id: input.id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.color !== undefined && { color: input.color }),
      },
    });

    // Update chapters if provided
    if (input.chapters !== undefined) {
      // Delete all existing chapter relationships
      await tx.collectionChapter.deleteMany({
        where: {
          collectionId: input.id,
        },
      });

      // Create new chapter relationships
      if (input.chapters.length > 0) {
        await tx.collectionChapter.createMany({
          data: input.chapters.map((chapter) => ({
            collectionId: input.id,
            chapterId: chapter.chapterId,
            order: chapter.order,
          })),
        });
      }
    }

    // Return the updated collection with chapters
    const updatedCollection = await tx.collection.findUnique({
      where: {
        id: input.id,
      },
      include: {
        CollectionChapters: true,
      },
    });

    if (!updatedCollection) {
      throw error(404, 'Collection not found');
    }

    return updatedCollection;
  });
}
