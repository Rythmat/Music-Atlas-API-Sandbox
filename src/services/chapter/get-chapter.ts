import { NoteKey } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getChapterSchema = t.Object({
  id: t.String(),
});

export const getChapterResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  noteKey: t.Nullable(t.Enum(NoteKey)),
  pages: t.Array(
    t.Object({
      id: t.String(),
      name: t.Nullable(t.String()),
      order: t.Number(),
      content: t.String(),
      description: t.Nullable(t.String()),
      noteKey: t.Nullable(t.Enum(NoteKey)),
      color: t.Nullable(t.String()),
      createdAt: t.Date(),
      updatedAt: t.Date(),
    }),
  ),
});

export async function getChapter(
  input: typeof getChapterSchema.static,
  { database }: ContextType,
) {
  const chapter = await database.chapter.findUnique({
    where: {
      id: input.id,
    },
    include: {
      Pages: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!chapter) {
    throw error(404, 'Chapter not found');
  }

  return {
    ...chapter,
    pages: chapter.Pages,
  };
}
