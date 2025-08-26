import { UserRole } from '@prisma/client';
import * as base from 'jsonwebtoken';
import { z } from 'zod';
import { Env } from '@/constants/env';

export const jwtPayloadSchema = z.object({
  user_id: z.string(),
  role: z.nativeEnum(UserRole),
});

export const jwt = {
  async sign(payload: z.infer<typeof jwtPayloadSchema>) {
    return base.sign(payload, Env.get('JWT_SECRET'), {
      expiresIn: '24h',
    });
  },
  async verify(token: string) {
    return new Promise<z.infer<typeof jwtPayloadSchema>>((resolve, reject) => {
      base.verify(token, Env.get('JWT_SECRET'), async (err, decoded) => {
        if (err || !decoded) {
          reject(err || new Error('Invalid token.'));
          return;
        }

        const { success, data } =
          await jwtPayloadSchema.safeParseAsync(decoded);

        if (!success) {
          reject(new Error('Invalid token.'));
          return;
        }

        resolve(data);
      });
    });
  },
};
