import { NoteKey } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listPagesSchema = t.Object({
  chapterId: t.Optional(t.String()),
});

export const listPagesResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    name: t.Nullable(t.String()),
    order: t.Number(),
    content: t.String(),
    description: t.Nullable(t.String()),
    noteKey: t.Nullable(t.Enum(NoteKey)),
    color: t.Nullable(t.String()),
    chapterId: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  }),
);

export async function listPages(
  input: typeof listPagesSchema.static,
  { database }: ContextType,
): Promise<typeof listPagesResponseSchema.static> {
  // Define the where clause for filtering
  const where: { chapterId?: string } = {};

  // Add chapterId to where clause if provided
  if (input.chapterId) {
    // Find the chapter to validate it exists
    const chapter = await database.chapter.findUnique({
      where: {
        id: input.chapterId,
      },
    });

    if (!chapter) {
      throw error(404, 'Chapter not found');
    }

    where.chapterId = input.chapterId;
  }
  // Get pages with pagination
  return await database.page.findMany({
    where,
    orderBy: {
      order: 'asc',
    },
  });
}
