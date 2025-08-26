import { Elysia } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createUser,
  createUserSchema,
  createUserResponseSchema,
} from '@/services/auth/create-user';
import { getMe, getMeResponseSchema } from '@/services/auth/get-me';
import { login, loginSchema, loginResponseSchema } from '@/services/auth/login';
import {
  recoverPassword,
  recoverPasswordSchema,
  recoverPasswordResponseSchema,
} from '@/services/auth/recover-password';
import {
  resetPassword,
  resetPasswordSchema,
  resetPasswordResponseSchema,
} from '@/services/auth/reset-password';
import { contextDecorator } from '../context';

export const authController = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Auth'],
  },
}).use(contextDecorator);

/**
 * @description Inicia um novo login.
 */
authController.post(
  '/login',
  async ({ body, context }) => {
    return await login(body, context);
  },
  {
    body: loginSchema,
    response: loginResponseSchema,
  },
);

authController.post(
  '/register',
  async ({ body, context }) => {
    return await createUser(body, context);
  },
  {
    body: createUserSchema,
    response: createUserResponseSchema,
  },
);

authController.derive(isAuthenticated).get(
  '/me',
  async ({ session, context }) => {
    return await getMe(session, context);
  },
  {
    response: getMeResponseSchema,
  },
);

authController.post(
  '/recover-password',
  async ({ body, context }) => {
    return await recoverPassword(body, context);
  },
  {
    body: recoverPasswordSchema,
    response: recoverPasswordResponseSchema,
  },
);

authController.post(
  '/reset-password',
  async ({ body, context }) => {
    return await resetPassword(body, context);
  },
  {
    body: resetPasswordSchema,
    response: resetPasswordResponseSchema,
  },
);
