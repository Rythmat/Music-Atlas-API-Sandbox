import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createNoteSequence,
  createNoteSequenceSchema,
  createNoteSequenceResponseSchema,
} from '@/services/note-sequence/create-note-sequence';
import {
  deleteNoteSequence,
  deleteNoteSequenceSchema,
  deleteNoteSequenceResponseSchema,
} from '@/services/note-sequence/delete-note-sequence';
import {
  getNoteSequence,
  getNoteSequenceSchema,
  getNoteSequenceResponseSchema,
} from '@/services/note-sequence/get-note-sequence';
import {
  listNoteSequences,
  listNoteSequencesSchema,
  listNoteSequencesResponseSchema,
} from '@/services/note-sequence/list-note-sequences';
import {
  updateNoteSequence,
  updateNoteSequenceSchema,
  updateNoteSequenceResponseSchema,
} from '@/services/note-sequence/update-note-sequence';
import { contextDecorator } from '../context';

export const noteSequenceController = new Elysia({
  prefix: '/note-sequences',
  detail: {
    tags: ['Note Sequences'],
  },
}).use(contextDecorator);

/**
 * @description List note sequences
 */
noteSequenceController.derive(isAuthenticated).get(
  '',
  async ({ query, context }) => {
    return await listNoteSequences(query, context);
  },
  {
    query: listNoteSequencesSchema,
    response: listNoteSequencesResponseSchema,
  },
);

/**
 * @description Get a note sequence by ID
 */
noteSequenceController.derive(isAuthenticated).get(
  '/:id',
  async ({ params, context }) => {
    return await getNoteSequence({ id: params.id }, context);
  },
  {
    params: getNoteSequenceSchema,
    response: getNoteSequenceResponseSchema,
  },
);

/**
 * @description Create a new note sequence
 */
noteSequenceController.derive(isAuthenticated).post(
  '',
  async ({ body, context }) => {
    return await createNoteSequence(body, context);
  },
  {
    body: createNoteSequenceSchema,
    response: createNoteSequenceResponseSchema,
  },
);

/**
 * @description Update an existing note sequence
 */
noteSequenceController.derive(isAuthenticated).patch(
  '/:id',
  async ({ body, params, context }) => {
    return await updateNoteSequence({ ...body, id: params.id }, context);
  },
  {
    body: updateNoteSequenceSchema,
    params: t.Object({
      id: t.String(),
    }),
    response: updateNoteSequenceResponseSchema,
  },
);

/**
 * @description Delete a note sequence
 */
noteSequenceController.derive(isAuthenticated).delete(
  '/:id',
  async ({ params, context }) => {
    return await deleteNoteSequence({ id: params.id }, context);
  },
  {
    params: deleteNoteSequenceSchema,
    response: deleteNoteSequenceResponseSchema,
  },
);
