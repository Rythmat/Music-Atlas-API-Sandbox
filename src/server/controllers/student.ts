import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  getStudent,
  getStudentResponseSchema,
} from '@/services/students/get-student';
import {
  listStudents,
  listStudentsSchema,
  listStudentsResponseSchema,
} from '@/services/students/list-students';
import {
  removeStudent,
  removeStudentResponseSchema,
} from '@/services/students/remove-student';
import {
  restoreStudent,
  restoreStudentResponseSchema,
} from '@/services/students/restore-student';
import {
  updateStudent,
  updateStudentSchema,
  updateStudentResponseSchema,
} from '@/services/students/update-student';
import { contextDecorator } from '../context';

export const studentController = new Elysia({
  prefix: '/students',
  detail: {
    tags: ['Students'],
  },
})
  .use(contextDecorator)
  .derive(isAuthenticated);

/**
 * @description List students with optional filtering by classroom
 */
studentController.get(
  '',
  async ({ query, context }) => {
    return await listStudents(query, context);
  },
  {
    query: listStudentsSchema,
    response: listStudentsResponseSchema,
  },
);

/**
 * @description Get a student by ID
 */
studentController.get(
  '/:id',
  async ({ params, context }) => {
    return await getStudent({ id: params.id }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: getStudentResponseSchema,
  },
);

/**
 * @description Update a student
 */
studentController.patch(
  '/:id',
  async ({ params, body, context }) => {
    return await updateStudent({ id: params.id, ...body }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: t.Omit(updateStudentSchema, ['id']),
    response: updateStudentResponseSchema,
  },
);

/**
 * @description Remove a student (soft delete)
 */
studentController.delete(
  '/:id',
  async ({ params, context }) => {
    return await removeStudent({ id: params.id }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: removeStudentResponseSchema,
  },
);

/**
 * @description Restore a previously removed student
 */
studentController.patch(
  '/:id/restore',
  async ({ params, context }) => {
    return await restoreStudent({ id: params.id }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: restoreStudentResponseSchema,
  },
);
