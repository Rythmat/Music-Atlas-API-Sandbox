import * as bcrypt from 'bcrypt';
import { error, t } from 'elysia';
import { jwt } from '@/lib/jwt';
import type { ContextType } from '@/server/context';

export const loginSchema = t.Object({
  email: t.Optional(t.String()),
  username: t.Optional(t.String()),
  password: t.String(),
});

export const loginResponseSchema = t.Object({
  token: t.String(),
});

export async function login(
  input: typeof loginSchema.static,
  { database }: ContextType,
): Promise<typeof loginResponseSchema.static> {
  const { email, username } = input;

  if (!email && !username) {
    throw error(400, 'Email or username is required');
  }

  const user = await database.user.findUnique({
    where: email ? { email } : { username: username! },
  });

  if (!user) {
    throw error(401, 'Invalid email or password');
  }

  if (!(await bcrypt.compare(input.password, user.password))) {
    throw error(401, 'Invalid email or password');
  }

  // Check if user is removed
  if (user.removedAt) {
    throw error(
      403,
      'Your account has been deactivated. Please contact support.',
    );
  }

  const token = await jwt.sign({
    user_id: user.id,
    role: user.role,
  });

  return { token };
}
