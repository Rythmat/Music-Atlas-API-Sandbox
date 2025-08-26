import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const deletePageSchema = t.Object({
  id: t.String(),
});

export const deletePageResponseSchema = t.Object({
  id: t.String(),
  deleted: t.Boolean(),
});

export async function deletePage(
  input: typeof deletePageSchema.static,
  { database }: ContextType,
): Promise<typeof deletePageResponseSchema.static> {
  // Find the page
  const page = await database.page.findUnique({
    where: {
      id: input.id,
    },
  });

  if (!page) {
    throw error(404, 'Page not found');
  }

  // Delete the page
  await database.page.delete({
    where: {
      id: input.id,
    },
  });

  return {
    id: input.id,
    deleted: true,
  };
}
