import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';
import { tuneSchema } from './types';

export const deleteTuneSchema = t.Object({
  id: t.String(),
});

export const deleteTuneResponseSchema = tuneSchema;

export async function deleteTune(
  input: typeof deleteTuneSchema.static,
  { database }: ContextType,
): Promise<typeof deleteTuneResponseSchema.static> {
  const tune = await database.tune.findUnique({
    where: { id: input.id },
  });

  if (!tune) {
    throw error(404, 'Tune not found');
  }

  return await database.$transaction(async (tx) => {
    await tx.note.deleteMany({
      where: { Measure: { tuneId: input.id } },
    });

    await tx.measure.deleteMany({
      where: { tuneId: input.id },
    });

    return await tx.tune.delete({
      where: { id: input.id },
    });
  });
}
