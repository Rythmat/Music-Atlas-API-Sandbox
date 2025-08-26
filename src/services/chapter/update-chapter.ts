import { NoteKey } from '@prisma/client';
import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const updateChapterSchema = t.Object({
  id: t.String(),
  name: t.Optional(t.String()),
  description: t.Optional(t.Nullable(t.String())),
  color: t.Optional(t.Nullable(t.String())),
  noteKey: t.Optional(t.Nullable(t.Enum(NoteKey))),
});

export const updateChapterResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  noteKey: t.Nullable(t.Enum(NoteKey)),
  color: t.Nullable(t.String()),
});

export async function updateChapter(
  input: typeof updateChapterSchema.static,
  { database }: ContextType,
): Promise<typeof updateChapterResponseSchema.static> {
  // Find the chapter first to make sure it exists
  const chapter = await database.chapter.findUnique({
    where: { id: input.id },
  });

  if (!chapter) {
    throw new Error('Chapter not found');
  }

  // Create a data object for the update
  const data: Record<string, string | null | number | NoteKey | undefined> = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  if (input.description !== undefined) {
    data.description = input.description;
  }

  if (input.color !== undefined) {
    data.color = input.color;
  }

  if (input.noteKey !== undefined) {
    data.noteKey = input.noteKey;
  }

  // Update the chapter
  return await database.chapter.update({
    where: { id: input.id },
    data,
  });
}
