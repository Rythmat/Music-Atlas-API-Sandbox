import { Filter } from 'bad-words';
import * as bcrypt from 'bcrypt';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

const filter = new Filter();

export const createUserSchema = t.Object({
  // Qualifies the role of the user and invite code
  role: t.Union([t.Literal('student'), t.Literal('teacher')]),
  code: t.String(),

  // Personal information
  email: t.Optional(t.String()),
  username: t.Optional(t.String()),
  birthDate: t.Optional(t.Date()),
  password: t.String(),
  nickname: t.String(),
  fullName: t.Optional(t.String()),

  // School information
  school: t.Optional(t.String()),
});

export const createUserResponseSchema = t.Object({
  id: t.String(),
  email: t.Nullable(t.String()),
  username: t.Nullable(t.String()),
  nickname: t.String(),
  fullName: t.Nullable(t.String()),
  school: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

const SALT_ROUNDS = 10;

const checkStudent = async (
  input: typeof createUserSchema.static,
  { database }: ContextType,
) => {
  if (!input.username) {
    throw error(400, 'Username is required for student accounts.');
  }

  if (filter.isProfane(input.username)) {
    throw error(400, 'Username contains profane language.');
  }

  if (input.birthDate && input.birthDate > new Date()) {
    throw error(400, 'Birth date cannot be in the future.');
  }

  const classroom = await database.classroom.findUnique({
    where: {
      code: input.code,
    },
  });

  if (!classroom) {
    throw error(
      404,
      'Classroom not found. Please double check the invite code and try again.',
    );
  }

  if (classroom.closedAt) {
    throw error(
      404,
      'Classroom no longer accepting students. Please talk to a teacher.',
    );
  }

  return classroom.id;
};

const checkTeacher = async (
  input: typeof createUserSchema.static,
  { database }: ContextType,
) => {
  if (!input.email) {
    throw error(400, 'Email is required for teacher accounts.');
  }

  const invite = await database.teacherInvite.findUnique({
    where: {
      code: input.code,
    },
  });

  if (!invite) {
    throw error(404, 'Invite code not found. Please contact support.');
  }

  if (invite.email !== input.email) {
    throw error(
      400,
      'Email does not match invite email. Please verify your email and try again.',
    );
  }

  if (invite.consumedAt) {
    throw error(400, 'Invite code already used. Please request a new one.');
  }
};

export async function createUser(
  input: typeof createUserSchema.static,
  context: ContextType,
): Promise<typeof createUserResponseSchema.static> {
  const { database } = context;
  let classroomId: string | undefined = undefined;

  // Check if the invite code is valid
  if (input.role === 'student') {
    classroomId = await checkStudent(input, context);
  } else {
    await checkTeacher(input, context);
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  return database.$transaction(async (tx) => {
    if (input.role === 'teacher') {
      await tx.teacherInvite.update({
        where: {
          code: input.code,
        },
        data: {
          consumedAt: new Date(),
        },
      });
    }

    return await tx.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashedPassword,
        nickname: input.nickname,
        fullName: input.fullName,
        birthDate: input.birthDate,
        school: input.school,
        role: input.role,
        ClassroomStudents:
          input.role === 'student' && classroomId
            ? {
                create: {
                  classroomId: classroomId,
                },
              }
            : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        nickname: true,
        fullName: true,
        school: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });
}
