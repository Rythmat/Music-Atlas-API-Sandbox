import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const deletePhraseMapSchema = t.Object({
  id: t.String(),
});

export const deletePhraseMapResponseSchema = t.Object({
  id: t.String(),
  label: t.Nullable(t.String()),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  beatsPerMinute: t.Number(),
  beatsPerBar: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export async function deletePhraseMap(
  input: typeof deletePhraseMapSchema.static,
  { database }: ContextType,
): Promise<typeof deletePhraseMapResponseSchema.static> {
  const phraseMap = await database.pagePhraseMap.count({
    where: { phraseMapId: input.id },
  });

  if (phraseMap > 0) {
    throw error(
      400,
      'Phrase map is being used in a page. Please remove the map from all pages before deleting.',
    );
  }

  return await database.phraseMap.delete({
    where: { id: input.id },
  });
}
