import { NoteKey } from '@prisma/client';
import { t } from 'elysia';
import { orderBy } from 'lodash';
import type { ContextType } from '@/server/context';

export const listChaptersSchema = t.Object({
  collectionId: t.Optional(t.String()),
});

export const listChaptersResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    name: t.String(),
    description: t.Nullable(t.String()),
    color: t.Nullable(t.String()),
    noteKey: t.Nullable(t.Enum(NoteKey)),
    order: t.Nullable(t.Number()),
    Pages: t.Array(
      t.Object({
        id: t.String(),
        name: t.Nullable(t.String()),
        order: t.Number(),
      }),
    ),
  }),
);

export async function listChapters(
  input: typeof listChaptersSchema.static,
  { database }: ContextType,
): Promise<typeof listChaptersResponseSchema.static> {
  // Create the where clause
  const where = {
    CollectionChapters: input.collectionId
      ? {
          some: {
            collectionId: input.collectionId,
          },
        }
      : undefined,
  };

  // Get chapters with pagination
  const chapters = await database.chapter.findMany({
    where,
    orderBy: {
      name: 'asc',
    },
    include: {
      ...(input.collectionId
        ? {
            CollectionChapters: {
              where: {
                collectionId: input.collectionId,
              },
              orderBy: {
                order: 'asc',
              },
            },
          }
        : {}),

      Pages: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          name: true,
          order: true,
        },
      },
    },
  });

  return orderBy(
    chapters.map((chapter) => ({
      ...chapter,
      order:
        (
          chapter as unknown as { CollectionChapters: { order: number }[] }
        )?.CollectionChapters?.at(0)?.order ?? null,
    })),
    'order',
  );
}
