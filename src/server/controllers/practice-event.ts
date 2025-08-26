import { Elysia } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createPracticeEvent,
  createPracticeEventSchema,
  createPracticeEventResponseSchema,
} from '@/services/practice-event/create-practice-event';
import {
  listPracticeEvents,
  listPracticeEventsSchema,
  listPracticeEventsResponseSchema,
} from '@/services/practice-event/list-practice-events';
import { contextDecorator } from '../context';

export const practiceEventController = new Elysia({
  prefix: '/practice-events',
  detail: {
    tags: ['Practice Events'],
  },
})
  .use(contextDecorator)
  .derive(isAuthenticated);

/**
 * @description Create a new practice event
 */
practiceEventController.post(
  '',
  async ({ body, context, session }) => {
    return await createPracticeEvent(body, context, session.id);
  },
  {
    body: createPracticeEventSchema,
    response: createPracticeEventResponseSchema,
  },
);

/**
 * @description List practice events
 */
practiceEventController.get(
  '',
  async ({ query, context }) => {
    return await listPracticeEvents(query, context);
  },
  {
    query: listPracticeEventsSchema,
    response: listPracticeEventsResponseSchema,
  },
);
