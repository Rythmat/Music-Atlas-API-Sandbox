import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const restoreClassroomStudentSchema = t.Object({
  classroomId: t.String(),
  studentId: t.String(),
});

export const restoreClassroomStudentResponseSchema = t.Object({
  id: t.String(),
  restored: t.Boolean(),
});

export async function restoreClassroomStudent(
  input: typeof restoreClassroomStudentSchema.static,
  { database }: ContextType,
  teacherId: string,
): Promise<typeof restoreClassroomStudentResponseSchema.static> {
  // Find the classroom
  const classroom = await database.classroom.findUnique({
    where: { id: input.classroomId },
  });

  if (!classroom) {
    throw error(404, 'Classroom not found');
  }

  // Check if the teacher owns this classroom
  if (classroom.teacherId !== teacherId) {
    throw error(
      403,
      'You do not have permission to restore students in this classroom',
    );
  }

  // Find the classroom student
  const classroomStudent = await database.classroomStudent.findFirst({
    where: {
      classroomId: input.classroomId,
      studentId: input.studentId,
    },
  });

  if (!classroomStudent) {
    throw error(404, 'Student not found in this classroom');
  }

  if (!classroomStudent.removedAt) {
    throw error(400, 'Student is not removed from this classroom');
  }

  // Restore the student
  const updatedClassroomStudent = await database.classroomStudent.update({
    where: { id: classroomStudent.id },
    data: { removedAt: null },
  });

  return {
    id: updatedClassroomStudent.id,
    restored: true,
  };
}
