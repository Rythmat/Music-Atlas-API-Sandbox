import { Elysia } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  listNotes,
  listNotesResponseSchema,
} from '@/services/notes/list-notes';
import { contextDecorator } from '../context';

export const notesController = new Elysia({
  prefix: '/notes',
  detail: {
    tags: ['Notes'],
  },
}).use(contextDecorator);

notesController.derive(isAuthenticated).get(
  '',
  async () => {
    return await listNotes();
  },
  {
    response: listNotesResponseSchema,
  },
);
