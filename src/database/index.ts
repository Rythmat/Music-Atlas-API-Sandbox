import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'stdout',
        level: 'warn',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
    ],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const database = globalThis.prisma ?? prismaClientSingleton();

export { database };

if (process.env.VERCEL_ENV !== 'production') {
  globalThis.prisma = database;
}

export function assertNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) {
    throw new Error('value must be an array');
  }

  return value.map((v) => Number(v));
}
