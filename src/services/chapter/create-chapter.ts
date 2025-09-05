import { NoteKey } from '@prisma/client';
import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const createChapterSchema = t.Object({
  name: t.String(),
  description: t.Optional(t.Nullable(t.String())),
  noteKey: t.Optional(t.Nullable(t.Enum(NoteKey))),
  color: t.Optional(t.String()),
  initialPage: t.Optional(
    t.Object({
      content: t.String(),
      description: t.Optional(t.Nullable(t.String())),
      noteKey: t.Optional(t.Nullable(t.Enum(NoteKey))),
      color: t.Optional(t.String()),
    }),
  ),
});

export const createChapterResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  noteKey: t.Nullable(t.Enum(NoteKey)),
  color: t.Nullable(t.String()),
  order: t.Number(),
  pages: t.Array(
    t.Object({
      id: t.String(),
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

export async function createChapter(
  input: typeof createChapterSchema.static,
  { database }: ContextType,
) {
  const last = await database.chapter.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const nextOrder = (last?.order ?? -1) + 1;

  // Create the chapter
  const chapter = await database.chapter.create({
    data: {
      name: input.name,
      description: input.description,
      noteKey: input.noteKey,
      color: input.color,
      order: nextOrder,
    },
  });

  // If initialPage is provided, create a page for the chapter
  let pages: Array<{
    id: string;
    order: number;
    content: string;
    description: string | null;
    noteKey: NoteKey | null;
    color: string | null;
    chapterId: string;
    createdAt: Date;
    updatedAt: Date;
  }> = [];
  if (input.initialPage) {
    const page = await database.page.create({
      data: {
        chapterId: chapter.id,
        content: input.initialPage.content,
        description: input.initialPage.description,
        noteKey: input.initialPage.noteKey,
        color: input.initialPage.color,
        order: 0,
      },
    });
    pages = [page];
  }

  return {
    ...chapter,
    pages,
  };
}
