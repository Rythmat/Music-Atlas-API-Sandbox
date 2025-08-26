import { UserRole } from '@prisma/client';
import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const joinClassroomSchema = t.Object({
  code: t.String(),
});

export const joinClassroomResponseSchema = t.Object({
  id: t.String(),
  classroomId: t.String(),
  classroomName: t.String(),
  joined: t.Boolean(),
});

export async function joinClassroom(
  input: typeof joinClassroomSchema.static,
  { database }: ContextType,
  studentId: string,
): Promise<typeof joinClassroomResponseSchema.static> {
  // Find the classroom by code
  const classroom = await database.classroom.findUnique({
    where: { code: input.code },
  });

  if (!classroom) {
    throw error(
      404,
      'Classroom not found. Please check the code and try again.',
    );
  }

  // Check if the classroom is closed
  if (classroom.closedAt) {
    throw error(400, 'This classroom is no longer accepting students.');
  }

  // Check if the user is a student
  const student = await database.user.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw error(404, 'Student not found');
  }

  if (student.role !== UserRole.student) {
    throw error(400, 'Only students can join classrooms');
  }

  // Check if the student is already in the classroom
  const existingEnrollment = await database.classroomStudent.findFirst({
    where: {
      classroomId: classroom.id,
      studentId,
    },
  });

  if (existingEnrollment) {
    // If the student was previously removed, check if they're blocked
    if (existingEnrollment.removedAt) {
      throw error(
        403,
        'You have been removed from this classroom. Please contact your teacher.',
      );
    }

    throw error(400, 'You are already enrolled in this classroom');
  }

  // Create the classroom student record
  const classroomStudent = await database.classroomStudent.create({
    data: {
      classroomId: classroom.id,
      studentId,
    },
  });

  return {
    id: classroomStudent.id,
    classroomId: classroom.id,
    classroomName: classroom.name,
    joined: true,
  };
}
