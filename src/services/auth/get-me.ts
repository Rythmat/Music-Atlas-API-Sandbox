import { t } from 'elysia';
import type { ContextType } from '@/server/context';

export const getMeSchema = t.Object({
  id: t.String(),
  email: t.Nullable(t.String()),
  username: t.Nullable(t.String()),
  birthDate: t.Nullable(t.Date()),
  nickname: t.String(),
  fullName: t.Nullable(t.String()),
  school: t.Nullable(t.String()),
  role: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const getMeResponseSchema = t.Object({
  id: t.String(),
  email: t.Nullable(t.String()),
  username: t.Nullable(t.String()),
  birthDate: t.Nullable(t.Date()),
  nickname: t.String(),
  fullName: t.Nullable(t.String()),
  school: t.Nullable(t.String()),
  role: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export async function getMe(
  input: typeof getMeSchema.static,
  _: ContextType,
): Promise<typeof getMeResponseSchema.static> {
  return input;
}
