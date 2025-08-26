import { PhraseBarNoteDuration, PhraseBarNoteType } from '@prisma/client';
import { error, t } from 'elysia';
import { assertNumberArray } from '@/database';
import type { ContextType } from '@/server/context';

export const getPhraseMapSchema = t.Object({
  id: t.String(),
});

export const getPhraseMapResponseSchema = t.Object({
  id: t.String(),
  label: t.Nullable(t.String()),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  beatsPerMinute: t.Number(),
  beatsPerBar: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  PhraseBars: t.Array(
    t.Object({
      id: t.String(),
      label: t.Nullable(t.String()),
      color: t.Nullable(t.String()),
      order: t.Number(),
      startRepeat: t.Boolean(),
      endRepeat: t.Boolean(),
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
    }),
  ),
});

export async function getPhraseMap(
  input: typeof getPhraseMapSchema.static,
  { database }: ContextType,
): Promise<typeof getPhraseMapResponseSchema.static> {
  const phraseMap = await database.phraseMap.findUnique({
    where: { id: input.id },
    include: {
      PhraseBars: {
        orderBy: {
          order: 'asc',
        },
        include: {
          PhraseBarNotes: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      },
    },
  });

  if (!phraseMap) {
    throw error(404, 'Phrase map not found');
  }

  return {
    ...phraseMap,
    PhraseBars: phraseMap.PhraseBars.map((phraseBar) => ({
      ...phraseBar,
      PhraseBarNotes: phraseBar.PhraseBarNotes.map((note) => ({
        ...note,
        noteNumbers: assertNumberArray(note.noteNumbers),
      })),
    })),
  };
}
