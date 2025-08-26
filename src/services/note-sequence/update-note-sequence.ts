import { t } from 'elysia';
import type { ContextType } from '@/server/context';
import { sequenceNoteSchema, type SequenceNoteInput } from './types';

export const updateNoteSequenceSchema = t.Object({
  id: t.String(),
  name: t.Optional(t.String()),
  tempo: t.Optional(t.Number()),
  timeSignature: t.Optional(t.String()),
  ticksPerBeat: t.Optional(t.Number()),
  notes: t.Optional(t.Array(sequenceNoteSchema)),
});

export const updateNoteSequenceResponseSchema = t.Object({
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
      noteSequenceId: t.String(),
    }),
  ),
});

export async function updateNoteSequence(
  input: typeof updateNoteSequenceSchema.static,
  { database }: ContextType,
): Promise<typeof updateNoteSequenceResponseSchema.static> {
  // Start a transaction to ensure all operations succeed or fail together
  return await database.$transaction(async (tx) => {
    // Update the note sequence
    await tx.noteSequence.update({
      where: { id: input.id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.tempo && { tempo: input.tempo }),
        ...(input.timeSignature && { timeSignature: input.timeSignature }),
        ...(input.ticksPerBeat && { ticksPerBeat: input.ticksPerBeat }),
      },
    });

    // Delete all existing notes for this sequence
    await tx.sequenceNote.deleteMany({
      where: { noteSequenceId: input.id },
    });

    // Create new notes
    if (input.notes && input.notes.length > 0) {
      await tx.sequenceNote.createMany({
        data: input.notes.map((note: SequenceNoteInput) => ({
          noteNumber: note.noteNumber,
          startTimeInTicks: note.startTimeInTicks,
          durationInTicks: note.durationInTicks,
          velocity: note.velocity,
          noteOffVelocity: note.noteOffVelocity,
          color: note.color,
          noteSequenceId: input.id,
        })),
      });
    }

    // Get the updated note sequence with its notes
    const updatedNoteSequence = await tx.noteSequence.findUnique({
      where: { id: input.id },
      include: { Notes: true },
    });

    if (!updatedNoteSequence) {
      throw new Error('Failed to update note sequence');
    }

    return updatedNoteSequence;
  });
}
