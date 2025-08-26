import { NoteKey } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const createPageSchema = t.Object({
  chapterId: t.String(),
  name: t.Optional(t.String()),
  content: t.String(),
  description: t.Optional(t.Nullable(t.String())),
  noteKey: t.Optional(t.Nullable(t.Enum(NoteKey))),
  color: t.Optional(t.String()),
  order: t.Optional(t.Number()),
});

export const createPageResponseSchema = t.Object({
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
});

export async function createPage(
  input: typeof createPageSchema.static,
  { database }: ContextType,
): Promise<typeof createPageResponseSchema.static> {
  return await database.$transaction(async (tx) => {
    // Find the chapter
    const chapter = await tx.chapter.findUnique({
      where: {
        id: input.chapterId,
      },
    });

    if (!chapter) {
      throw error(404, 'Chapter not found');
    }

    // If order is not provided, calculate it
    let order = input.order;
    if (order === undefined) {
      // Get the highest order value and add 1
      const highestOrderPage = await tx.page.findFirst({
        where: { chapterId: input.chapterId },
        orderBy: { order: 'desc' },
      });
      order = highestOrderPage ? highestOrderPage.order + 1 : 0;
    }

    // Create the page
    const page = await tx.page.create({
      data: {
        chapterId: input.chapterId,
        name: input.name,
        content: input.content,
        description: input.description,
        noteKey: input.noteKey,
        color: input.color,
        order,
      },
    });

    const updatedPage = await tx.page.findUnique({
      where: {
        id: page.id,
      },
    });

    if (!updatedPage) {
      throw error(500, 'Failed to create page');
    }

    return updatedPage;
  });
}
