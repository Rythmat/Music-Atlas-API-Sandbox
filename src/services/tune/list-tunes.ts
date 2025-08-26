import { t } from 'elysia';
import type { ContextType } from '@/server/context';
import { tuneWithCountsSchema } from './types';

export const listTunesResponseSchema = t.Array(tuneWithCountsSchema);

export async function listTunes(
  _input: undefined,
  { database }: ContextType,
): Promise<typeof listTunesResponseSchema.static> {
  // Get the total count for pagination metadata and the tunes with measure counts
  const tunes = await database.tune.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          Measures: true,
        },
      },
    },
  });

  // For each tune, get the total note count
  return await Promise.all(
    tunes.map(async (tune) => {
      const notesCount = await database.note.count({
        where: {
          Measure: {
            tuneId: tune.id,
          },
        },
      });

      return {
        ...tune,
        measures: tune._count.Measures,
        notes: notesCount,
      };
    }),
  );
}
