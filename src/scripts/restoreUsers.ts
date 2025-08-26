import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = JSON.parse(fs.readFileSync('user_backup.json', 'utf-8'));

    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          nickname: user.nickname,
          fullName: user.fullName,
          school: user.school,
          role: user.role,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
    }

    console.info('Users restored successfully!');
  } catch (error) {
    console.error('Error restoring users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
