import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createTeacherInvitation,
  createTeacherInvitationSchema,
  createTeacherInvitationResponseSchema,
} from '@/services/invitation/create-teacher-invitation';
import {
  getTeacherInvitation,
  getTeacherInvitationResponseSchema,
} from '@/services/invitation/get-teacher-invitation';
import {
  listTeacherInvitations,
  listTeacherInvitationsSchema,
  listTeacherInvitationsResponseSchema,
} from '@/services/invitation/list-teacher-invitations';
import {
  revokeTeacherInvitation,
  revokeTeacherInvitationResponseSchema,
} from '@/services/invitation/revoke-teacher-invitation';
import { contextDecorator } from '../context';

export const invitationController = new Elysia({
  prefix: '/teachers/invitations',
  detail: {
    tags: ['Teachers', 'Invitations'],
  },
}).use(contextDecorator);

invitationController.get(
  '/:code',
  async ({ params, context }) => {
    return await getTeacherInvitation({ code: params.code }, context);
  },
  {
    params: t.Object({
      code: t.String(),
    }),
    response: getTeacherInvitationResponseSchema,
  },
);

/**
 * @description Create a new teacher invitation
 */
invitationController.derive(isAuthenticated).post(
  '',
  async ({ body, context }) => {
    return await createTeacherInvitation(body, context);
  },
  {
    body: createTeacherInvitationSchema,
    response: createTeacherInvitationResponseSchema,
    detail: {
      description: 'Creates a new teacher invitation',
    },
  },
);

/**
 * @description List teacher invitations
 */
invitationController.derive(isAuthenticated).get(
  '',
  async ({ query, context }) => {
    return await listTeacherInvitations(query, context);
  },
  {
    query: listTeacherInvitationsSchema,
    response: listTeacherInvitationsResponseSchema,
  },
);

/**
 * @description Revoke a teacher invitation
 */
invitationController.derive(isAuthenticated).delete(
  '/:id',
  async ({ params, context }) => {
    return await revokeTeacherInvitation({ id: params.id }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: revokeTeacherInvitationResponseSchema,
  },
);
