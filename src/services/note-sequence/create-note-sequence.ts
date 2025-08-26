import { t } from 'elysia';
import type { ContextType } from '@/server/context';
import { sequenceNoteSchema, type SequenceNoteInput } from './types';

export const createNoteSequenceSchema = t.Object({
  name: t.String(),
  tempo: t.Number(),
  timeSignature: t.String(),
  ticksPerBeat: t.Number(),
  notes: t.Optional(t.Array(sequenceNoteSchema)),
});

export const createNoteSequenceResponseSchema = t.Object({
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

export async function createNoteSequence(
  input: typeof createNoteSequenceSchema.static,
  { database }: ContextType,
): Promise<typeof createNoteSequenceResponseSchema.static> {
  // Start a transaction to ensure all operations succeed or fail together
  return await database.$transaction(async (tx) => {
    // Create the note sequence
    const noteSequence = await tx.noteSequence.create({
      data: {
        name: input.name,
        tempo: input.tempo,
        timeSignature: input.timeSignature,
        ticksPerBeat: input.ticksPerBeat,
      },
    });

    // Create notes if provided
    if (input.notes && input.notes.length > 0) {
      await tx.sequenceNote.createMany({
        data: input.notes.map((note: SequenceNoteInput) => ({
          noteNumber: note.noteNumber,
          startTimeInTicks: note.startTimeInTicks,
          durationInTicks: note.durationInTicks,
          velocity: note.velocity,
          noteOffVelocity: note.noteOffVelocity,
          color: note.color,
          noteSequenceId: noteSequence.id,
        })),
      });
    }

    // Get the created note sequence with its notes
    const createdNoteSequence = await tx.noteSequence.findUnique({
      where: { id: noteSequence.id },
      include: { Notes: true },
    });

    if (!createdNoteSequence) {
      throw new Error('Failed to create note sequence');
    }

    return createdNoteSequence;
  });
}
