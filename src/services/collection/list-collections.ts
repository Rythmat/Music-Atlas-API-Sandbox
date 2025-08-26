import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listCollectionsSchema = t.Object({
  includeEmpty: t.Optional(t.Boolean({ default: false })),
});

export const listCollectionsResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    name: t.String(),
    description: t.Nullable(t.String()),
    color: t.Nullable(t.String()),
    chapters: t.Number(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  }),
);

export async function listCollections(
  input: typeof listCollectionsSchema.static,
  { database }: ContextType,
): Promise<typeof listCollectionsResponseSchema.static> {
  const collections = await database.collection.findMany({
    where: {
      CollectionChapters: input.includeEmpty
        ? undefined
        : {
            some: {},
          },
    },
    include: {
      _count: {
        select: {
          CollectionChapters: true,
        },
      },
    },
  });

  return collections.map((collection) => ({
    ...collection,
    chapters: collection._count.CollectionChapters,
  }));
}
