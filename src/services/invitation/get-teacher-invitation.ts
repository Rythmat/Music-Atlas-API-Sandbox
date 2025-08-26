import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getTeacherInvitationSchema = t.Object({
  code: t.String(),
});

export const getTeacherInvitationResponseSchema = t.Object({
  id: t.String(),
  code: t.String(),
  email: t.String(),
  viewCount: t.Number(),
  expiresAt: t.Optional(t.Nullable(t.Date())),
  createdAt: t.Date(),
});

export async function getTeacherInvitation(
  input: typeof getTeacherInvitationSchema.static,
  { database }: ContextType,
): Promise<typeof getTeacherInvitationResponseSchema.static> {
  // Get the invitations
  const invitation = await database.teacherInvite.findUnique({
    where: { code: input.code },
    select: {
      id: true,
      code: true,
      email: true,
      viewCount: true,
      expiresAt: true,
      consumedAt: true,
      createdAt: true,
    },
  });

  if (!invitation) {
    throw error(404, 'Invitation not found');
  }

  if (invitation.consumedAt) {
    throw error(400, 'Invitation code already used');
  }

  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    throw error(400, 'Invitation code expired');
  }

  await database.teacherInvite.update({
    where: { id: invitation.id },
    data: {
      viewCount: {
        increment: 1,
      },
      lastViewedAt: new Date(),
    },
  });

  return {
    id: invitation.id,
    code: invitation.code,
    email: invitation.email,
    viewCount: invitation.viewCount,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
  };
}
