import { PrismaClient } from '@prisma/client';
import { Elysia } from 'elysia';
import { database } from '@/database';
import { storage } from '@/lib/storage';

export type ContextType = {
  database: PrismaClient;
  storage: typeof storage;
};

const context = {
  database,
  storage,
} satisfies ContextType;

export const contextDecorator = new Elysia({
  name: 'context/decorator',
}).decorate('context', context);
