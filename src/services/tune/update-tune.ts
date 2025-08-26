import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';
import { tuneWithMeasuresSchema, createMeasureInputSchema } from './types';

export const updateTuneSchema = t.Object({
  id: t.String(),
  title: t.Optional(t.Nullable(t.String())),
  tempo: t.Optional(t.Number()),
  beatsPerMeasure: t.Optional(t.Number()),
  beatUnit: t.Optional(t.Number()),
  key: t.Optional(t.Nullable(t.String())),
  color: t.Optional(t.Nullable(t.String())),
  measures: t.Optional(t.Array(createMeasureInputSchema)),
});

export const updateTuneResponseSchema = tuneWithMeasuresSchema;

export async function updateTune(
  input: typeof updateTuneSchema.static,
  { database }: ContextType,
): Promise<typeof updateTuneResponseSchema.static> {
  const tune = await database.tune.findUnique({
    where: { id: input.id },
  });

  if (!tune) {
    throw error(404, 'Tune not found');
  }

  // Begin a transaction to update the tune and recreate measures and notes
  return await database.$transaction(async (tx) => {
    // 1. Update the tune properties
    await tx.tune.update({
      where: { id: input.id },
      data: {
        title: input.title !== undefined ? input.title : tune.title,
        tempo: input.tempo !== undefined ? input.tempo : tune.tempo,
        beatsPerMeasure:
          input.beatsPerMeasure !== undefined
            ? input.beatsPerMeasure
            : tune.beatsPerMeasure,
        beatUnit: input.beatUnit !== undefined ? input.beatUnit : tune.beatUnit,
        key: input.key !== undefined ? input.key : tune.key,
        color: input.color !== undefined ? input.color : tune.color,
      },
    });

    // 2. If new measures are provided, delete all existing measures and recreate
    if (input.measures !== undefined) {
      // Delete all existing measures (will cascade delete notes as well)
      await tx.note.deleteMany({
        where: { Measure: { tuneId: input.id } },
      });

      await tx.measure.deleteMany({
        where: { tuneId: input.id },
      });

      // Create new measures with their notes
      if (input.measures.length > 0) {
        for (const measure of input.measures) {
          await tx.measure.create({
            data: {
              tuneId: input.id,
              label: measure.label,
              number: measure.number,
              repeatStart: measure.repeatStart ?? false,
              repeatEnd: measure.repeatEnd ?? false,
              repeatTimes: measure.repeatTimes,
              color: measure.color,
              Notes: {
                create: measure.notes.map((note) => ({
                  label: note.label,
                  color: note.color,
                  pitch: note.pitch,
                  startOffsetInBeats: note.startOffsetInBeats,
                  type: note.type,
                  velocity: note.velocity,
                })),
              },
            },
          });
        }
      }
    }

    // Return the updated tune with all its measures and notes
    const updatedTuneWithMeasures = await tx.tune.findUnique({
      where: { id: input.id },
      include: {
        Measures: {
          orderBy: { number: 'asc' },
          include: {
            Notes: {
              orderBy: { startOffsetInBeats: 'asc' },
            },
          },
        },
      },
    });

    if (!updatedTuneWithMeasures) {
      throw error(500, 'Failed to retrieve updated tune');
    }

    return updatedTuneWithMeasures;
  });
}
