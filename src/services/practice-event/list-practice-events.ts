import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listPracticeEventsSchema = t.Object({
  studentId: t.Optional(t.String()),
  pageId: t.Optional(t.String()),
});

export const listPracticeEventsResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    pageId: t.String(),
    studentId: t.String(),
    createdAt: t.Date(),
  }),
);

export async function listPracticeEvents(
  input: typeof listPracticeEventsSchema.static,
  { database }: ContextType,
): Promise<typeof listPracticeEventsResponseSchema.static> {
  // Build the where clause based on the input
  const where: {
    studentId?: string;
    pageId?: string;
  } = {};

  if (input.studentId) {
    where.studentId = input.studentId;
  }

  if (input.pageId) {
    where.pageId = input.pageId;
  }

  // If neither studentId nor pageId is provided, throw an error
  if (!input.studentId && !input.pageId) {
    throw error(400, 'Either studentId or pageId must be provided');
  }

  // Get the practice events
  return await database.practiceEvent.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });
}
