import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { database } from '@/database';

const USER_TO_CREATE: {
  email: string;
  nickname: string;
  fullName: string | null;
  school: string | null;
  role: UserRole;
} = {
  email: 'marcel@bitcomplete.io',
  nickname: 'marcel',
  fullName: 'Marcel Coelho',
  school: null,
  role: 'admin',
};

const generatePassword = () => {
  return Math.random().toString(36).substring(2, 15);
};

async function main() {
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await database.user.findUnique({
    where: {
      email: USER_TO_CREATE.email,
    },
  });

  if (!user) {
    await database.user.create({
      data: {
        password: hashedPassword,
        email: USER_TO_CREATE.email,
        nickname: USER_TO_CREATE.nickname,
        fullName: USER_TO_CREATE.fullName,
        school: USER_TO_CREATE.school,
        role: USER_TO_CREATE.role,
      },
    });
  } else {
    await database.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  console.info(`User created: ${USER_TO_CREATE.email}`);
  console.info(`Password: ${password}`);
}

main();
