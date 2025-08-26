import { NoteKey } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getPageSchema = t.Object({
  id: t.String(),
});

export const getPageResponseSchema = t.Object({
  id: t.String(),
  name: t.Nullable(t.String()),
  order: t.Number(),
  content: t.String(),
  description: t.Nullable(t.String()),
  noteKey: t.Nullable(t.Enum(NoteKey)),
  color: t.Nullable(t.String()),
  chapterId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export async function getPage(
  input: typeof getPageSchema.static,
  { database }: ContextType,
) {
  const page = await database.page.findUnique({
    where: {
      id: input.id,
    },
  });

  if (!page) {
    throw error(404, 'Page not found');
  }

  return page;
}
