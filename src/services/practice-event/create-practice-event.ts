import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const createPracticeEventSchema = t.Object({
  pageId: t.String(),
});

export const createPracticeEventResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
});

export async function createPracticeEvent(
  input: typeof createPracticeEventSchema.static,
  { database }: ContextType,
  studentId: string,
): Promise<typeof createPracticeEventResponseSchema.static> {
  // Find the page
  const page = await database.page.findUnique({
    where: {
      id: input.pageId,
    },
  });

  if (!page) {
    throw error(404, 'Page not found');
  }

  // Check if the student has created a practice event in the last 4 hours
  const fourHoursAgo = new Date();
  fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);

  const recentEvent = await database.practiceEvent.findFirst({
    where: {
      studentId,
      createdAt: { gte: fourHoursAgo },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // If there's a recent event, return success without creating a new one
  if (recentEvent) {
    return {
      success: true,
      message: 'Practice recorded',
    };
  }

  // Create the practice event
  await database.practiceEvent.create({
    data: {
      pageId: input.pageId,
      studentId,
    },
  });

  return {
    success: true,
    message: 'Practice recorded',
  };
}
