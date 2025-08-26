import { PrismaClient } from '@prisma/client';

/**
 * Generates a unique 8-character alphanumeric code
 * @param database Prisma client instance
 * @returns A unique alphanumeric code
 */
export async function generateAlphanumericCode(
  database: PrismaClient,
  subject: 'teacherInvite' | 'classroom',
): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 8;
  let isUnique = false;
  let code = '';

  // Keep generating codes until we find a unique one
  while (!isUnique) {
    code = '';
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    if (subject === 'teacherInvite') {
      // Check if code already exists in invitations
      const existingInvitation = await database.teacherInvite.findUnique({
        where: { code },
      });

      isUnique = !existingInvitation;
    } else if (subject === 'classroom') {
      // Check if code already exists in classrooms
      const existingClassroom = await database.classroom.findUnique({
        where: { code },
      });

      isUnique = !existingClassroom;
    }
  }

  return code;
}
