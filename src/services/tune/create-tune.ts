import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';
import { createMeasureInputSchema, tuneWithMeasuresSchema } from './types';

export const createTuneSchema = t.Object({
  title: t.Optional(t.String()),
  tempo: t.Number(),
  beatsPerMeasure: t.Number(),
  beatUnit: t.Number(),
  key: t.Optional(t.String()),
  color: t.Optional(t.Nullable(t.String())),
  measures: t.Optional(t.Array(createMeasureInputSchema)),
});

export const createTuneResponseSchema = tuneWithMeasuresSchema;

export async function createTune(
  input: typeof createTuneSchema.static,
  { database }: ContextType,
): Promise<typeof createTuneResponseSchema.static> {
  // Create tune with optional measures and notes
  return await database.$transaction(async (tx) => {
    // First create the tune
    const tune = await tx.tune.create({
      data: {
        title: input.title,
        tempo: input.tempo,
        beatsPerMeasure: input.beatsPerMeasure,
        beatUnit: input.beatUnit,
        key: input.key,
        color: input.color,
      },
    });

    // If measures are provided, create them with their notes
    if (input.measures && input.measures.length > 0) {
      for (const measure of input.measures) {
        await tx.measure.create({
          data: {
            tuneId: tune.id,
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

    // Return the created tune with measures and notes
    const tuneWithMeasures = await tx.tune.findUnique({
      where: { id: tune.id },
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

    if (!tuneWithMeasures) {
      throw error(400, 'Failed to create tune');
    }

    return tuneWithMeasures;
  });
}
