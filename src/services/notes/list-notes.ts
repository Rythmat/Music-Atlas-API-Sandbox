import { t } from 'elysia';
import { getNoteName, getOctaveByNote, Notes } from '@/constants/notes';

export const listNotesResponseSchema = t.Array(
  t.Object({
    midi: t.Number(),
    key: t.String(),
    octave: t.Number(),
    offset: t.Number(),
    noteName: t.String(),
    noteNameFlat: t.Nullable(t.String()),
    noteNameSharp: t.Nullable(t.String()),
  }),
);

export async function listNotes(): Promise<
  typeof listNotesResponseSchema.static
> {
  return Object.entries(Notes).map(([key, value]) => ({
    midi: value,
    key,
    octave: getOctaveByNote(value),
    offset: value % 12,
    noteName: getNoteName(value).main,
    noteNameFlat: getNoteName(value).flat,
    noteNameSharp: getNoteName(value).sharp,
  }));
}
