import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const revokeTeacherInvitationSchema = t.Object({
  id: t.String(),
});

export const revokeTeacherInvitationResponseSchema = t.Object({
  id: t.String(),
  revoked: t.Boolean(),
});

export async function revokeTeacherInvitation(
  input: typeof revokeTeacherInvitationSchema.static,
  { database }: ContextType,
): Promise<typeof revokeTeacherInvitationResponseSchema.static> {
  // Find the invitation
  const invitation = await database.teacherInvite.findUnique({
    where: { id: input.id },
  });

  if (!invitation) {
    throw error(404, 'Invitation not found');
  }

  if (invitation.consumedAt) {
    throw error(400, 'Invitation has already been consumed');
  }

  // Set the expiration date to now to effectively revoke it
  await database.teacherInvite.update({
    where: { id: input.id },
    data: { expiresAt: new Date() },
  });

  return {
    id: invitation.id,
    revoked: true,
  };
}
