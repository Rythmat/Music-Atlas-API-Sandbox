import { NoteType } from '@prisma/client';
import { t } from 'elysia';

export const noteSchema = t.Object({
  id: t.String(),
  label: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  pitch: t.String(),
  startOffsetInBeats: t.Number({
    minimum: 0,
    maximum: 1,
  }),
  type: t.Enum(NoteType),
  velocity: t.Nullable(t.Number()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  measureId: t.String(),
});

export const measureSchema = t.Object({
  id: t.String(),
  label: t.Nullable(t.String()),
  number: t.Number(),
  repeatStart: t.Boolean(),
  repeatEnd: t.Boolean(),
  repeatTimes: t.Nullable(t.Number()),
  color: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  tuneId: t.String(),
});

export const measureWithNotesSchema = t.Composite([
  measureSchema,
  t.Object({
    Notes: t.Array(noteSchema),
  }),
]);

export const tuneSchema = t.Object({
  id: t.String(),
  title: t.Nullable(t.String()),
  tempo: t.Number(),
  beatsPerMeasure: t.Number(),
  beatUnit: t.Number(),
  key: t.Nullable(t.String()),
  color: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const tuneWithMeasuresSchema = t.Composite([
  tuneSchema,
  t.Object({
    Measures: t.Array(measureWithNotesSchema),
  }),
]);

export const tuneWithCountsSchema = t.Composite([
  tuneSchema,
  t.Object({
    measures: t.Number(),
    notes: t.Number(),
  }),
]);

// Schema for creating notes
export const createNoteInputSchema = t.Object({
  label: t.Optional(t.Nullable(t.String())),
  color: t.Optional(t.Nullable(t.String())),
  pitch: t.String(),
  startOffsetInBeats: t.Number({
    minimum: 0,
    maximum: 1,
  }),
  type: t.Enum(NoteType),
  velocity: t.Optional(t.Nullable(t.Number())),
});

// Schema for creating measures within a tune
export const createMeasureInputSchema = t.Object({
  label: t.Optional(t.Nullable(t.String())),
  number: t.Number(),
  repeatStart: t.Optional(t.Boolean({ default: false })),
  repeatEnd: t.Optional(t.Boolean({ default: false })),
  repeatTimes: t.Optional(t.Nullable(t.Number())),
  color: t.Optional(t.Nullable(t.String())),
  notes: t.Array(createNoteInputSchema),
});

// Schema for updating existing notes
export const updateNoteInputSchema = t.Composite([
  t.Object({
    id: t.Optional(t.String()), // Optional for new notes
  }),
  createNoteInputSchema,
]);

// Schema for updating measures within a tune
export const updateMeasureInputSchema = t.Object({
  id: t.Optional(t.String()), // Optional for new measures
  label: t.Optional(t.Nullable(t.String())),
  number: t.Number(),
  repeatStart: t.Optional(t.Boolean()),
  repeatEnd: t.Optional(t.Boolean()),
  repeatTimes: t.Optional(t.Nullable(t.Number())),
  color: t.Optional(t.Nullable(t.String())),
  notes: t.Array(updateNoteInputSchema),
});
