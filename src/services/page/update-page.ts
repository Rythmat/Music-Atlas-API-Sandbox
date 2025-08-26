import { NoteKey } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const updatePageSchema = t.Object({
  id: t.String(),
  name: t.Optional(t.String()),
  content: t.Optional(t.String()),
  description: t.Optional(t.Nullable(t.String())),
  noteKey: t.Optional(t.Nullable(t.Enum(NoteKey))),
  color: t.Optional(t.Nullable(t.String())),
  order: t.Optional(t.Number()),
  noteSequenceIds: t.Optional(t.Array(t.String())),
  playAlongIds: t.Optional(t.Array(t.String())),
  phraseMapIds: t.Optional(t.Array(t.String())),
});

// Define schemas for related entities
const noteSequenceSchema = t.Object({
  id: t.String(),
  name: t.String(),
  root: t.Nullable(t.String()),
  type: t.Nullable(t.String()),
  tempo: t.Number(),
  timeSignature: t.String(),
  ticksPerBeat: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

const pageNoteSequenceSchema = t.Object({
  id: t.String(),
  pageId: t.String(),
  noteSequenceId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  NoteSequence: noteSequenceSchema,
});

const pagePlayAlongSchema = t.Object({
  id: t.String(),
  pageId: t.String(),
  playAlongId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

const pagePhraseMapSchema = t.Object({
  id: t.String(),
  pageId: t.String(),
  phraseMapId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const updatePageResponseSchema = t.Object({
  id: t.String(),
  name: t.Nullable(t.String()),
  order: t.Number(),
  content: t.String(),
  description: t.Nullable(t.String()),
  noteKey: t.Nullable(t.Enum(NoteKey)),
  color: t.Nullable(t.String()),
  chapterId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  PageNoteSequences: t.Array(pageNoteSequenceSchema),
  PagePlayAlongs: t.Array(pagePlayAlongSchema),
  PagePhraseMaps: t.Array(pagePhraseMapSchema),
});

export async function updatePage(
  input: typeof updatePageSchema.static,
  { database }: ContextType,
): Promise<typeof updatePageResponseSchema.static> {
  // Start a transaction to handle both page update and relationships
  return await database.$transaction(async (tx) => {
    // Find the page
    const existingPage = await tx.page.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!existingPage) {
      throw error(404, 'Page not found');
    }

    // Prepare operations to run in parallel
    const operations: Promise<unknown>[] = [
      tx.page.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          content: input.content,
          description: input.description,
          noteKey: input.noteKey,
          color: input.color,
          order: input.order,
        },
      }),
    ];

    // Only delete relationships if they're being updated
    if (input.noteSequenceIds !== undefined) {
      operations.push(
        tx.pageNoteSequence.deleteMany({
          where: {
            pageId: input.id,
          },
        }),
      );
    }

    if (input.playAlongIds !== undefined) {
      operations.push(
        tx.pagePlayAlong.deleteMany({
          where: {
            pageId: input.id,
          },
        }),
      );
    }

    if (input.phraseMapIds !== undefined) {
      operations.push(
        tx.pagePhraseMap.deleteMany({
          where: { pageId: input.id },
        }),
      );
    }

    // Run all operations in parallel
    await Promise.all(operations);

    const relationshipPromises: Promise<unknown>[] = [];

    // Handle note sequence relationships if provided
    if (
      Array.isArray(input.noteSequenceIds) &&
      input.noteSequenceIds.length > 0
    ) {
      // Create new relationships
      relationshipPromises.push(
        tx.pageNoteSequence.createMany({
          data: input.noteSequenceIds.map((noteSequenceId) => ({
            pageId: input.id,
            noteSequenceId,
          })),
        }),
      );
    }

    // Handle MIDI relationships if provided
    if (Array.isArray(input.playAlongIds) && input.playAlongIds.length > 0) {
      // Create new relationships
      relationshipPromises.push(
        tx.pagePlayAlong.createMany({
          data: input.playAlongIds.map((playAlongId) => ({
            pageId: input.id,
            playAlongId,
          })),
        }),
      );
    }

    // Handle phrase map relationships if provided
    if (Array.isArray(input.phraseMapIds) && input.phraseMapIds.length > 0) {
      // Create new relationships
      relationshipPromises.push(
        tx.pagePhraseMap.createMany({
          data: input.phraseMapIds.map((phraseMapId) => ({
            pageId: input.id,
            phraseMapId,
          })),
        }),
      );
    }

    if (relationshipPromises.length > 0) {
      await Promise.all(relationshipPromises);
    }

    // Return the updated page with fresh relationships
    const updatedPage = await tx.page.findUnique({
      where: {
        id: input.id,
      },
      include: {
        PageNoteSequences: {
          include: {
            NoteSequence: true,
          },
        },
        PagePlayAlongs: {
          include: {
            PlayAlong: true,
          },
        },
        PagePhraseMaps: {
          include: {
            PhraseMap: true,
          },
        },
      },
    });

    if (!updatedPage) {
      throw error(500, 'Failed to update page');
    }

    return updatedPage;
  });
}
