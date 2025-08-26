import { Prisma } from '@prisma/client';
import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listNoteSequencesSchema = t.Object({
  page: t.Optional(t.Number({ default: 1, minimum: 1 })),
  pageSize: t.Optional(t.Number({ default: 20, minimum: 1, maximum: 100 })),
  name: t.Optional(t.String()),
});

export const listNoteSequencesResponseSchema = t.Object({
  data: t.Array(
    t.Object({
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
    }),
  ),
  pagination: t.Object({
    total: t.Number(),
    page: t.Number(),
    pageSize: t.Number(),
    totalPages: t.Number(),
  }),
});

export async function listNoteSequences(
  input: typeof listNoteSequencesSchema.static,
  { database }: ContextType,
): Promise<typeof listNoteSequencesResponseSchema.static> {
  // Define the where clause for filtering
  const where = input.name
    ? {
        name: {
          contains: input.name,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : undefined;

  // Pagination parameters
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  // Get the total count for pagination metadata
  const totalCount = await database.noteSequence.count({ where });

  // Get note sequences with pagination
  const noteSequences = await database.noteSequence.findMany({
    skip,
    take: pageSize,
    include: { Notes: true },
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: noteSequences,
    pagination: {
      total: totalCount,
      page,
      pageSize,
      totalPages,
    },
  };
}
