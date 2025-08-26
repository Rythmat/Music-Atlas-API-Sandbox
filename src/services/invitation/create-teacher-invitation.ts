import { addDays } from 'date-fns';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';
import { generateAlphanumericCode } from './utils';

export const createTeacherInvitationSchema = t.Object({
  email: t.String(),
});

export const createTeacherInvitationResponseSchema = t.Object({
  id: t.String(),
  code: t.String(),
  email: t.String(),
  expiresAt: t.Optional(t.Nullable(t.Date())),
  createdAt: t.Date(),
});

export async function createTeacherInvitation(
  input: typeof createTeacherInvitationSchema.static,
  { database }: ContextType,
): Promise<typeof createTeacherInvitationResponseSchema.static> {
  // Check if email is already registered
  const existingUser = await database.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw error(400, 'Email is already registered');
  }

  // Check if there's an active invitation for this email
  const existingInvitation = await database.teacherInvite.findFirst({
    where: {
      email: input.email,
      consumedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  if (existingInvitation) {
    throw error(400, 'An active invitation already exists for this email');
  }

  // Generate a unique 8-character alphanumeric code
  const code = await generateAlphanumericCode(database, 'teacherInvite');

  // Create the invitation
  const invitation = await database.teacherInvite.create({
    data: {
      email: input.email,
      code,
      expiresAt: addDays(new Date(), 14),
    },
  });

  return {
    id: invitation.id,
    code: invitation.code,
    email: invitation.email,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
  };
}
