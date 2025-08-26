import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    fs.writeFileSync('user_backup.json', JSON.stringify(users, null, 2));
    console.info('Users backed up successfully!');
  } catch (error) {
    console.error('Error backing up users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
