import { Elysia, t } from 'elysia';
import { isAuthenticated } from '@/auth/isAuthenticated';
import {
  listTeachers,
  listTeachersSchema,
  listTeachersResponseSchema,
} from '@/services/teachers/list-teachers';
import {
  removeTeacher,
  removeTeacherResponseSchema,
} from '@/services/teachers/remove-teacher';
import {
  restoreTeacher,
  restoreTeacherResponseSchema,
} from '@/services/teachers/restore-teacher';
import { contextDecorator } from '../context';

export const teacherController = new Elysia({
  prefix: '/teachers',
  detail: {
    tags: ['Teachers'],
  },
})
  .use(contextDecorator)
  .derive(isAuthenticated);

/**
 * @description List all teachers
 */
teacherController.get(
  '',
  async ({ query, context }) => {
    return await listTeachers(query, context);
  },
  {
    query: listTeachersSchema,
    response: listTeachersResponseSchema,
  },
);

/**
 * @description Remove a teacher (soft delete)
 */
teacherController.delete(
  '/:id',
  async ({ params, context }) => {
    return await removeTeacher({ id: params.id }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: removeTeacherResponseSchema,
  },
);

/**
 * @description Restore a previously removed teacher
 */
teacherController.patch(
  '/:id/restore',
  async ({ params, context }) => {
    return await restoreTeacher({ id: params.id }, context);
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: restoreTeacherResponseSchema,
  },
);
