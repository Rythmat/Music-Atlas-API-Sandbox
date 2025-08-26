import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  createClassroom,
  createClassroomSchema,
  createClassroomResponseSchema,
} from '@/services/classroom/create-classroom';
import {
  getClassroom,
  getClassroomResponseSchema,
} from '@/services/classroom/get-classroom';
import {
  getClassrooms,
  getClassroomsResponseSchema,
} from '@/services/classroom/get-classrooms';
import {
  joinClassroom,
  joinClassroomSchema,
  joinClassroomResponseSchema,
} from '@/services/classroom/join-classroom';
import {
  listClassrooms,
  listClassroomsSchema,
  listClassroomsResponseSchema,
} from '@/services/classroom/list-classrooms';
import {
  removeClassroomStudent,
  removeClassroomStudentResponseSchema,
} from '@/services/classroom/remove-classroom-student';
import {
  restoreClassroomStudent,
  restoreClassroomStudentResponseSchema,
} from '@/services/classroom/restore-classroom-student';
import {
  updateClassroom,
  updateClassroomSchema,
  updateClassroomResponseSchema,
} from '@/services/classroom/update-classroom';
import { contextDecorator } from '../context';
export const classroomController = new Elysia({
  prefix: '/classrooms',
  detail: {
    tags: ['Classrooms'],
  },
}).use(contextDecorator);

/**
 * @description Get a classroom by id
 */
classroomController.get(
  '/:id',
  async ({ params, context }) => {
    return await getClassroom({ id: params.id }, context);
  },
  {
    params: t.Object({ id: t.String() }),
    response: getClassroomResponseSchema,
  },
);

/**
 * @description Get a classroom by code
 */
classroomController.get(
  '/details/:code',
  async ({ params, context }) => {
    return await getClassrooms({ code: params.code }, context);
  },
  {
    params: t.Object({ code: t.String() }),
    response: getClassroomsResponseSchema,
  },
);

/**
 * @description Create a new classroom (teacher only)
 */
classroomController.derive(isAuthenticated).post(
  '',
  async ({ body, context, session }) => {
    return await createClassroom(body, context, session.id);
  },
  {
    body: createClassroomSchema,
    response: createClassroomResponseSchema,
  },
);

/**
 * @description Update a classroom (teacher only)
 */
classroomController.derive(isAuthenticated).patch(
  '/:id',
  async ({ params, body, context, session }) => {
    return await updateClassroom(
      { ...body, id: params.id },
      context,
      session.id,
    );
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: t.Omit(updateClassroomSchema, ['id']),
    response: updateClassroomResponseSchema,
  },
);

/**
 * @description List classrooms (filtered by teacher for non-admins)
 */
classroomController.derive(isAuthenticated).get(
  '',
  async ({ query, context, session }) => {
    return await listClassrooms(query, context, session.id, session.role);
  },
  {
    query: listClassroomsSchema,
    response: listClassroomsResponseSchema,
  },
);

// Endpoint removed: List students in a classroom
// This functionality is now handled by the student controller with classroomId parameter

/**
 * @description Remove a student from a classroom
 */
classroomController.derive(isAuthenticated).delete(
  '/:id/students/:studentId',
  async ({ params, context, session }) => {
    return await removeClassroomStudent(
      {
        classroomId: params.id,
        studentId: params.studentId,
      },
      context,
      session.id,
    );
  },
  {
    params: t.Object({
      id: t.String(),
      studentId: t.String(),
    }),
    response: removeClassroomStudentResponseSchema,
  },
);

/**
 * @description Restore a previously removed student
 */
classroomController.derive(isAuthenticated).patch(
  '/:id/students/:studentId/restore',
  async ({ params, context, session }) => {
    return await restoreClassroomStudent(
      {
        classroomId: params.id,
        studentId: params.studentId,
      },
      context,
      session.id,
    );
  },
  {
    params: t.Object({
      id: t.String(),
      studentId: t.String(),
    }),
    response: restoreClassroomStudentResponseSchema,
  },
);

/**
 * @description Join a classroom using a code (student only)
 */
classroomController.derive(isAuthenticated).post(
  '/join',
  async ({ body, context, session }) => {
    return await joinClassroom(body, context, session.id);
  },
  {
    body: joinClassroomSchema,
    response: joinClassroomResponseSchema,
  },
);
