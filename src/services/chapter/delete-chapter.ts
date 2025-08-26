import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const deleteChapterSchema = t.Object({
  id: t.String(),
});

export async function deleteChapter(
  input: typeof deleteChapterSchema.static,
  { database }: ContextType,
) {
  // Start a transaction to ensure all operations succeed or fail together
  return await database.$transaction(async (tx) => {
    // First, delete any collection-chapter relationships
    await tx.collectionChapter.deleteMany({
      where: { chapterId: input.id },
    });

    // Then delete the chapter
    const chapter = await tx.chapter.delete({
      where: { id: input.id },
    });

    return { success: true, deletedChapterId: chapter.id };
  });
}
