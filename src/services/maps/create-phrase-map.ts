import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const createPhraseMapSchema = t.Object({
  label: t.String(),
  description: t.Optional(t.String()),
  color: t.Optional(t.String()),
  beatsPerMinute: t.Optional(t.Number({ minimum: 0, maximum: 240 })),
  beatsPerBar: t.Optional(t.Number({ minimum: 1, maximum: 16 })),
  repeatCount: t.Optional(t.Number({ minimum: 1 })),
  shouldLoop: t.Optional(t.Boolean()),
});

export const createPhraseMapResponseSchema = t.Object({
  id: t.String(),
  label: t.Nullable(t.String()),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  beatsPerMinute: t.Number(),
  beatsPerBar: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export async function createPhraseMap(
  input: typeof createPhraseMapSchema.static,
  { database }: ContextType,
): Promise<typeof createPhraseMapResponseSchema.static> {
  return await database.phraseMap.create({
    data: {
      label: input.label,
      description: input.description,
      color: input.color,
      beatsPerMinute: input.beatsPerMinute,
      beatsPerBar: input.beatsPerBar,
    },
  });
}
