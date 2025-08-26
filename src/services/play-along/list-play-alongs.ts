import { t } from 'elysia';
import type { ContextType } from '@/server/context';
import { playAlongSchema } from './types';

export const listPlayAlongSchema = t.Object({
  page: t.Optional(t.Number({ default: 1, minimum: 1 })),
  pageSize: t.Optional(t.Number({ default: 20, minimum: 1, maximum: 100 })),
});

export const listPlayAlongResponseSchema = t.Object({
  data: t.Array(playAlongSchema),
  pagination: t.Object({
    total: t.Number(),
    page: t.Number(),
    pageSize: t.Number(),
    totalPages: t.Number(),
  }),
});

export async function listPlayAlong(
  input: typeof listPlayAlongSchema.static,
  { database }: ContextType,
): Promise<typeof listPlayAlongResponseSchema.static> {
  // Pagination parameters
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  // Get the total count for pagination metadata and the play along-s
  const [totalCount, playAlong] = await Promise.all([
    database.playAlong.count(),
    database.playAlong.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: playAlong,
    pagination: {
      total: totalCount,
      page,
      pageSize,
      totalPages,
    },
  };
}
