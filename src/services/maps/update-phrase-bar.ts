import { PhraseBarNoteType, PhraseBarNoteDuration } from '@prisma/client';
import { error, t } from 'elysia';
import { MidiNoteSchema } from '@/constants/notes';
import { assertNumberArray } from '@/database';
import type { ContextType } from '@/server/context';

export const updatePhraseBarSchema = t.Object({
  id: t.String(),
  label: t.Optional(t.Nullable(t.String())),
  color: t.Optional(t.Nullable(t.String())),
  order: t.Optional(t.Number()),
  startRepeat: t.Optional(t.Boolean()),
  endRepeat: t.Optional(t.Boolean()),
  notes: t.Array(
    t.Object({
      noteType: t.Enum(PhraseBarNoteType),
      noteNumbers: t.Array(MidiNoteSchema),
      noteDuration: t.Enum(PhraseBarNoteDuration),
      color: t.Optional(t.Nullable(t.String())),
      order: t.Optional(t.Number()),
      label: t.Optional(t.Nullable(t.String())),
    }),
  ),
});

export const updatePhraseBarResponseSchema = t.Object({
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
      order: t.Number(),
      label: t.Nullable(t.String()),
    }),
  ),
});

export async function updatePhraseBar(
  input: typeof updatePhraseBarSchema.static,
  { database }: ContextType,
): Promise<typeof updatePhraseBarResponseSchema.static> {
  return await database.$transaction(async (tx) => {
    const phraseBar = await tx.phraseBar.findUnique({
      where: { id: input.id },
    });

    if (!phraseBar) {
      throw error(404, 'Phrase bar not found');
    }

    const updatedPhraseBar = await tx.phraseBar.update({
      where: { id: input.id },
      data: {
        label: input.label,
        color: input.color,
        order: input.order,
        startRepeat: input.startRepeat,
        endRepeat: input.endRepeat,
        PhraseBarNotes: {
          // Wipe all existing notes
          deleteMany: {},

          // Create new notes
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
      ...updatedPhraseBar,
      PhraseBarNotes: updatedPhraseBar.PhraseBarNotes.map((note) => ({
        ...note,
        noteNumbers: assertNumberArray(note.noteNumbers),
      })),
    };
  });
}
