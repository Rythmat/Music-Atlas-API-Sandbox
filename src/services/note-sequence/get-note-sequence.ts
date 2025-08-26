import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getNoteSequenceSchema = t.Object({
  id: t.String(),
});

export const getNoteSequenceResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  tempo: t.Number(),
  timeSignature: t.String(),
  ticksPerBeat: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  Notes: t.Array(
    t.Object({
      id: t.String(),
      noteNumber: t.Number(),
      startTimeInTicks: t.Number(),
      durationInTicks: t.Number(),
      velocity: t.Number(),
      noteOffVelocity: t.Nullable(t.Number()),
      color: t.Nullable(t.String()),
      noteSequenceId: t.String(),
    }),
  ),
});

export async function getNoteSequence(
  input: typeof getNoteSequenceSchema.static,
  { database }: ContextType,
): Promise<typeof getNoteSequenceResponseSchema.static> {
  const noteSequence = await database.noteSequence.findUnique({
    where: { id: input.id },
    include: { Notes: true },
  });

  if (!noteSequence) {
    throw new Error('Note sequence not found');
  }

  return noteSequence;
}
