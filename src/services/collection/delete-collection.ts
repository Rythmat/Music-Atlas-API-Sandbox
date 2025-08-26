import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const deleteCollectionSchema = t.Object({
  id: t.String(),
});

export const deleteCollectionResponseSchema = t.Object({
  success: t.Boolean(),
  deletedCollectionId: t.String(),
});

export async function deleteCollection(
  input: typeof deleteCollectionSchema.static,
  { database }: ContextType,
): Promise<typeof deleteCollectionResponseSchema.static> {
  // Start a transaction to ensure all operations succeed or fail together
  return await database.$transaction(async (tx) => {
    // First, delete any collection-chapter relationships
    await tx.collectionChapter.deleteMany({
      where: { collectionId: input.id },
    });

    // Then delete the collection
    const collection = await tx.collection.delete({
      where: { id: input.id },
    });

    return { success: true, deletedCollectionId: collection.id };
  });
}
