import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listPhraseMapsSchema = t.Object({
  page: t.Optional(t.Number({ default: 1, minimum: 1 })),
  pageSize: t.Optional(t.Number({ default: 20, minimum: 1, maximum: 100 })),
});

export const listPhraseMapsResponseSchema = t.Object({
  data: t.Array(
    t.Object({
      id: t.String(),
      label: t.Nullable(t.String()),
      description: t.Nullable(t.String()),
      color: t.Nullable(t.String()),
      beatsPerMinute: t.Number(),
      beatsPerBar: t.Number(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      bars: t.Number(),
    }),
  ),
  pagination: t.Object({
    total: t.Number(),
    page: t.Number(),
    pageSize: t.Number(),
    totalPages: t.Number(),
  }),
});

export async function listPhraseMaps(
  input: typeof listPhraseMapsSchema.static,
  { database }: ContextType,
): Promise<typeof listPhraseMapsResponseSchema.static> {
  // Pagination parameters
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  // Get the total count for pagination metadata and the phrase maps
  const [totalCount, phraseMaps] = await Promise.all([
    database.phraseMap.count(),
    database.phraseMap.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            PhraseBars: true,
          },
        },
      },
    }),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: phraseMaps.map((phraseMap) => ({
      ...phraseMap,
      bars: phraseMap._count.PhraseBars,
      _count: undefined,
    })),
    pagination: {
      total: totalCount,
      page,
      pageSize,
      totalPages,
    },
  };
}
