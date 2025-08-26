import { NoteKey } from '@prisma/client';
import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getCollectionSchema = t.Object({
  id: t.String(),
});

// Define schemas for related entities
const chapterSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  noteKey: t.Nullable(t.Enum(NoteKey)),
  color: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

const collectionChapterSchema = t.Object({
  id: t.String(),
  order: t.Number(),
  collectionId: t.String(),
  chapterId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  Chapter: chapterSchema,
});

export const getCollectionResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  CollectionChapters: t.Array(collectionChapterSchema),
});

export async function getCollection(
  input: typeof getCollectionSchema.static,
  { database }: ContextType,
) {
  const collection = await database.collection.findUnique({
    where: { id: input.id },
    include: {
      CollectionChapters: {
        include: {
          Chapter: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!collection) {
    throw new Error('Collection not found');
  }

  return collection;
}
