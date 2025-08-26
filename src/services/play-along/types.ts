import { t } from 'elysia';

export const playAlongSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  midiFilePath: t.Nullable(t.String()),
  midiBeatsPerMinute: t.Nullable(t.Number()),
  audioFilePath: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
