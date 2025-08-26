import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const listTeacherInvitationsSchema = t.Object({
  status: t.Optional(
    t.Union([
      t.Literal('all'),
      t.Literal('active'),
      t.Literal('expired'),
      t.Literal('consumed'),
    ]),
  ),
});

export const listTeacherInvitationsResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    code: t.String(),
    email: t.String(),
    viewCount: t.Number(),
    lastViewedAt: t.Optional(t.Nullable(t.Date())),
    expiresAt: t.Optional(t.Nullable(t.Date())),
    consumedAt: t.Optional(t.Nullable(t.Date())),
    createdAt: t.Date(),
  }),
);

export async function listTeacherInvitations(
  input: typeof listTeacherInvitationsSchema.static,
  { database }: ContextType,
): Promise<typeof listTeacherInvitationsResponseSchema.static> {
  const now = new Date();

  // Build the where clause based on the status filter
  const where: {
    consumedAt?: { not: null } | null;
    expiresAt?: { lte: Date } | { gt: Date } | null;
    OR?: Array<{ expiresAt: null } | { expiresAt: { gt: Date } }>;
  } = {};

  if (input.status === 'active') {
    where.consumedAt = null;
    where.OR = [{ expiresAt: null }, { expiresAt: { gt: now } }];
  } else if (input.status === 'expired') {
    where.consumedAt = null;
    where.expiresAt = { lte: now };
  } else if (input.status === 'consumed') {
    where.consumedAt = { not: null };
  }

  // Get the invitations
  return await database.teacherInvite.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}
