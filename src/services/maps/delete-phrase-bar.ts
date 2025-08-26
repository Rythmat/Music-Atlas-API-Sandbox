import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const deletePhraseBarSchema = t.Object({
  id: t.String(),
});

export const deletePhraseBarResponseSchema = t.Object({
  id: t.String(),
  label: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  order: t.Number(),
  startRepeat: t.Boolean(),
  endRepeat: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export async function deletePhraseBar(
  input: typeof deletePhraseBarSchema.static,
  { database }: ContextType,
): Promise<typeof deletePhraseBarResponseSchema.static> {
  return await database.$transaction(async (tx) => {
    await tx.phraseBarNote.deleteMany({
      where: { phraseBarId: input.id },
    });

    return await tx.phraseBar.delete({
      where: { id: input.id },
    });
  });
}
