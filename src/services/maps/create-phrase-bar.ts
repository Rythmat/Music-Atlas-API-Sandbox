import { PhraseBarNoteType, PhraseBarNoteDuration } from '@prisma/client';
import { t } from 'elysia';
import { assertNumberArray } from '@/database';
import type { ContextType } from '@/server/context';

export const createPhraseBarSchema = t.Object({
  phraseMapId: t.String(),
  id: t.Optional(t.String()),
  label: t.Optional(t.String()),
  color: t.Optional(t.String()),
  order: t.Optional(t.Number()),
  startRepeat: t.Optional(t.Boolean()),
  endRepeat: t.Optional(t.Boolean()),
  notes: t.Array(
    t.Object({
      id: t.Optional(t.String()),
      noteType: t.Enum(PhraseBarNoteType),
      noteNumbers: t.Array(t.Number()),
      noteDuration: t.Enum(PhraseBarNoteDuration),
      color: t.Optional(t.String()),
      label: t.Optional(t.String()),
      order: t.Number(),
    }),
  ),
});

export const createPhraseBarResponseSchema = t.Object({
  id: t.String(),
  label: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  order: t.Number(),
  startRepeat: t.Boolean(),
  endRepeat: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  PhraseBarNotes: t.Array(
    t.Object({
      id: t.String(),
      noteType: t.Enum(PhraseBarNoteType),
      noteNumbers: t.Array(t.Number()),
      noteDuration: t.Enum(PhraseBarNoteDuration),
      color: t.Nullable(t.String()),
      label: t.Nullable(t.String()),
      order: t.Number(),
    }),
  ),
});

export async function createPhraseBar(
  input: typeof createPhraseBarSchema.static,
  { database }: ContextType,
): Promise<typeof createPhraseBarResponseSchema.static> {
  const phraseBar = await database.phraseBar.create({
    data: {
      id: input.id,
      label: input.label,
      color: input.color,
      order: input.order,
      startRepeat: input.startRepeat,
      endRepeat: input.endRepeat,
      phraseMapId: input.phraseMapId,
      PhraseBarNotes: {
        create: input.notes.map((note) => ({
          noteType: note.noteType,
          noteNumbers: assertNumberArray(note.noteNumbers),
          noteDuration: note.noteDuration,
          color: note.color,
          order: note.order,
        })),
      },
    },
    include: {
      PhraseBarNotes: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  return {
    ...phraseBar,
    PhraseBarNotes: phraseBar.PhraseBarNotes.map((note) => ({
      ...note,
      noteNumbers: assertNumberArray(note.noteNumbers),
    })),
  };
}
