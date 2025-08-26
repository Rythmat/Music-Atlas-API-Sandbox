import { error, t } from 'elysia';
import type { ContextType } from '@/server/context';

export const removeClassroomStudentSchema = t.Object({
  classroomId: t.String(),
  studentId: t.String(),
});

export const removeClassroomStudentResponseSchema = t.Object({
  id: t.String(),
  removed: t.Boolean(),
  removedAt: t.Date(),
});

export async function removeClassroomStudent(
  input: typeof removeClassroomStudentSchema.static,
  { database }: ContextType,
  teacherId: string,
): Promise<typeof removeClassroomStudentResponseSchema.static> {
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
      'You do not have permission to remove students from this classroom',
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

  if (classroomStudent.removedAt) {
    throw error(400, 'Student is already removed from this classroom');
  }

  // Remove the student (soft delete)
  const removedAt = new Date();
  const updatedClassroomStudent = await database.classroomStudent.update({
    where: { id: classroomStudent.id },
    data: { removedAt },
  });

  return {
    id: updatedClassroomStudent.id,
    removed: true,
    removedAt,
  };
}
