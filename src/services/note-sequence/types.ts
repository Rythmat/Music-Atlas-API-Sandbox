import { t } from 'elysia';

// Define the schema for a sequence note
export const sequenceNoteSchema = t.Object({
  noteNumber: t.Number(),
  startTimeInTicks: t.Number(),
  durationInTicks: t.Number(),
  velocity: t.Number(),
  noteOffVelocity: t.Optional(t.Number()),
  color: t.Optional(t.Nullable(t.String())),
});

// Define the type for a sequence note
export type SequenceNoteInput = typeof sequenceNoteSchema.static;
