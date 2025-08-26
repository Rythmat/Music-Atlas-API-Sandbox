import bcrypt from 'bcrypt';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const resetPasswordSchema = t.Object({
  token: t.String(),
  password: t.String(),
  currentUserId: t.Optional(t.String()),
});

export const resetPasswordResponseSchema = t.Object({
  ok: t.Literal(true),
});

export async function resetPassword(
  input: typeof resetPasswordSchema.static,
  { database }: ContextType,
): Promise<typeof resetPasswordResponseSchema.static> {
  const { token, password, currentUserId } = input;

  // Admins can reset the password of any user
  if (currentUserId) {
    const user = await database.user.findUnique({
      where: { id: currentUserId },
    });

    if (!user || user.role !== 'admin') {
      throw error(401, 'You are not authorized to reset this password.');
    }

    await database.user.update({
      where: { id: currentUserId },
      data: {
        password: await bcrypt.hash(password, 10),
      },
    });

    return { ok: true };
  }

  const user = await database.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw error(
      401,
      'Invalid or expired reset link. Please request a new one.',
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await database.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    },
  });

  return { ok: true };
}
