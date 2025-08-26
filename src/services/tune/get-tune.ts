import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';
import { tuneWithMeasuresSchema } from './types';

export const getTuneSchema = t.Object({
  id: t.String(),
});

export const getTuneResponseSchema = tuneWithMeasuresSchema;

export async function getTune(
  input: typeof getTuneSchema.static,
  { database }: ContextType,
): Promise<typeof getTuneResponseSchema.static> {
  const tune = await database.tune.findUnique({
    where: { id: input.id },
    include: {
      Measures: {
        orderBy: { number: 'asc' },
        include: {
          Notes: {
            orderBy: { startOffsetInBeats: 'asc' },
          },
        },
      },
    },
  });

  if (!tune) {
    throw error(404, 'Tune not found');
  }

  return tune;
}
