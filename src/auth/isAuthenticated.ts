import { User } from '@prisma/client';
import { InferContext, error } from 'elysia';
import { jwt } from '@/lib/jwt';
import { contextDecorator } from '@/server/context';
import { defineAbilities } from './permissions';

export const isAuthenticated: (
  params: InferContext<typeof contextDecorator>,
) => Promise<{
  session: Omit<User, 'password'>;
  ability: ReturnType<typeof defineAbilities>;
}> = async ({ headers, context }) => {
  try {
    const token = headers.authorization?.split(' ').at(1);

    if (!token) {
      throw error(
        'Unauthorized',
        'Request is not authenticated. Please sign in.',
      );
    }

    const decoded = await jwt.verify(token);
    const _user = await context.database.user.findUnique({
      where: { id: decoded.user_id },
    });

    if (!_user) {
      throw error('Unauthorized', 'User not found.');
    }

    // Check if user is removed
    if (_user.removedAt) {
      throw error(
        'Unauthorized',
        'Your account has been deactivated. Please contact support.',
      );
    }

    const user = {
      ..._user,
      password: undefined,
    };

    delete user.password;

    const ability = defineAbilities(user);

    return {
      session: user,
      ability,
    };
  } catch (caught) {
    throw error('Unauthorized', 'Session not found. Please sign in again.');
  }
};
