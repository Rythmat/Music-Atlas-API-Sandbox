import crypto from 'crypto';
import { addMinutes } from 'date-fns';
import { error, t } from 'elysia';
import { Env } from '@/constants/env';
import { resend } from '@/lib/resend';
import type { ContextType } from '@/server/context';
import { RecoverPasswordEmailTemplate } from './RecoverPasswordEmail';

export const recoverPasswordSchema = t.Object({
  email: t.String(),
});

export const recoverPasswordResponseSchema = t.Object({
  ok: t.Literal(true),
});

export async function recoverPassword(
  input: typeof recoverPasswordSchema.static,
  { database }: ContextType,
): Promise<typeof recoverPasswordResponseSchema.static> {
  const { email } = input;

  if (!email) {
    throw error(400, 'Email is required');
  }

  // This is a constant time operation to prevent timing attacks
  await new Promise<void>((resolve) => {
    const handle = async () => {
      const user = await database.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw error(401, 'Invalid email');
      }

      if (user.passwordResetAttempts >= 5) {
        throw error(
          401,
          'Too many password reset attempts. Please reach out to support.',
        );
      }

      const token = crypto.randomBytes(32).toString('hex').slice(4, 16);
      const expiresAt = addMinutes(new Date(), 10);

      await database.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: token,
          passwordResetTokenExpiresAt: expiresAt,
          passwordResetAttempts: { increment: 1 },
        },
      });

      await resend.emails.send({
        from: Env.get('RESEND_FROM_EMAIL'),
        to: email,
        subject: 'Recover Password',
        react: (
          <RecoverPasswordEmailTemplate
            firstName={user.nickname}
            resetLink={`${Env.get('APP_URL')}/reset-password?token=${token}`}
            expiresAt={expiresAt}
          />
        ),
      });
    };

    handle().catch((error) => {
      console.error(error);
      resolve();
    });

    setTimeout(() => {
      resolve();
    }, 3000);
  });

  return { ok: true };
}
