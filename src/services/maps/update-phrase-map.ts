import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const updatePhraseMapSchema = t.Object({
  id: t.String(),
  label: t.Optional(t.Nullable(t.String())),
  description: t.Optional(t.Nullable(t.String())),
  color: t.Optional(t.Nullable(t.String())),
  beatsPerMinute: t.Optional(t.Number({ minimum: 0, maximum: 240 })),
  beatsPerBar: t.Optional(t.Number({ minimum: 1, maximum: 16 })),
});

export const updatePhraseMapResponseSchema = t.Object({
  id: t.String(),
  label: t.Nullable(t.String()),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  beatsPerMinute: t.Nullable(t.Number({ minimum: 0, maximum: 240 })),
  beatsPerBar: t.Nullable(t.Number({ minimum: 1, maximum: 16 })),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export async function updatePhraseMap(
  input: typeof updatePhraseMapSchema.static,
  { database }: ContextType,
): Promise<typeof updatePhraseMapResponseSchema.static> {
  return await database.phraseMap.update({
    where: { id: input.id },
    data: {
      label: input.label,
      description: input.description,
      color: input.color,
      beatsPerMinute: input.beatsPerMinute,
      beatsPerBar: input.beatsPerBar,
    },
  });
}
