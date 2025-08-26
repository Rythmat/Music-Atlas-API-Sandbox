import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const deleteNoteSequenceSchema = t.Object({
  id: t.String(),
});

export const deleteNoteSequenceResponseSchema = t.Object({
  success: t.Boolean(),
  deletedNoteSequenceId: t.String(),
});

export async function deleteNoteSequence(
  input: typeof deleteNoteSequenceSchema.static,
  { database }: ContextType,
): Promise<typeof deleteNoteSequenceResponseSchema.static> {
  // Start a transaction to ensure all operations succeed or fail together
  return await database.$transaction(async (tx) => {
    // First, delete all notes associated with this sequence
    await tx.sequenceNote.deleteMany({
      where: { noteSequenceId: input.id },
    });

    // Then delete the note sequence
    const noteSequence = await tx.noteSequence.delete({
      where: { id: input.id },
    });

    return { success: true, deletedNoteSequenceId: noteSequence.id };
  });
}
