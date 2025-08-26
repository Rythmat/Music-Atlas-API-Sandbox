import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';
import { User, UserRole } from '@prisma/client';
import { error } from 'elysia';

// Define your subjects (resources)
export type SubjectType =
  | 'Collection'
  | 'Chapter'
  | 'CollectionChapter'
  | 'NoteSequence'
  | 'SequenceNote'
  | 'Midi'
  | 'ChapterMidi'
  | 'ChapterNoteSequence'
  | 'User'
  | 'Invitation'
  | 'Classroom'
  | 'ClassroomStudent'
  | 'Page'
  | 'PracticeEvent';

// Define your actions
export type Actions =
  | 'manage'
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'toggle'
  | 'join'
  | 'remove'
  | 'restore';

// Define the ability type
export type AppAbility = MongoAbility<
  [
    Actions,
    (
      | SubjectType
      | SubjectType
      | { type: SubjectType; id?: string; teacherId?: string }
    ),
  ]
>;

// Helper function to define abilities based on user role
function defineAbilityFor(user: Omit<User, 'password'>) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility,
  );

  // Check if user is removed
  if (user.removedAt) {
    // Removed users can only read content
    can('read', ['Chapter', 'Collection', 'NoteSequence', 'Midi', 'Page']);
    return build();
  }

  // Admin role permissions
  if (user.role === UserRole.admin) {
    // Admins can do everything
    can('manage', [
      'Chapter',
      'Collection',
      'NoteSequence',
      'Midi',
      'ChapterMidi',
      'ChapterNoteSequence',
      'User',
      'Invitation',
      'Classroom',
      'ClassroomStudent',
      'Page',
      'PracticeEvent',
    ]);
  }

  // Teacher role permissions
  else if (user.role === UserRole.teacher) {
    // Educational content - read access
    can('read', [
      'Chapter',
      'Collection',
      'CollectionChapter',
      'NoteSequence',
      'SequenceNote',
      'Midi',
      'ChapterMidi',
      'ChapterNoteSequence',
      'Page',
      'PracticeEvent',
    ]);

    // Teachers can create and update pages
    can(['create', 'update', 'delete'], 'Page');

    // Classroom management - full access to own classrooms
    can('manage', 'Classroom', { teacherId: user.id });
    can(['read', 'create', 'update', 'toggle'], 'Classroom', {
      teacherId: user.id,
    });

    // Student management within own classrooms
    can(['read', 'remove', 'restore'], 'ClassroomStudent', {
      Classroom: { teacherId: user.id },
    });
  }

  // Student role permissions
  else if (user.role === UserRole.student) {
    // Educational content - read access
    can('read', [
      'Chapter',
      'Collection',
      'CollectionChapter',
      'NoteSequence',
      'SequenceNote',
      'Midi',
      'ChapterMidi',
      'ChapterNoteSequence',
      'Page',
    ]);

    // Students can create practice events and view their own
    can('create', 'PracticeEvent');
    can('read', 'PracticeEvent', { studentId: user.id });

    // Classroom - can join classrooms and view enrolled classrooms
    can('join', 'Classroom');
    can('read', 'Classroom', {
      ClassroomStudents: { some: { studentId: user.id, removedAt: null } },
    });

    // Cannot access removed classrooms
    cannot('read', 'Classroom', { closedAt: { $ne: null } });
  }

  return build();
}

// Create the authorization middleware
export const defineAbilities = (user: Omit<User, 'password'>) => {
  const ability = defineAbilityFor(user);

  return {
    can: (
      action: Actions,
      subject: SubjectType,
      conditions?: Record<string, unknown>,
    ) => {
      const isAllowed = ability.can(
        action,
        conditions ? { type: subject, ...conditions } : subject,
      );
      if (!isAllowed) {
        throw error(403, `You don't have permission to ${action} ${subject}`);
      }
      return isAllowed;
    },
    cannot: (
      action: Actions,
      subject: SubjectType,
      conditions?: Record<string, unknown>,
    ) => {
      const isNotAllowed = ability.cannot(
        action,
        conditions ? { type: subject, ...conditions } : subject,
      );
      if (isNotAllowed) {
        throw error(403, `You don't have permission to ${action} ${subject}`);
      }
      return isNotAllowed;
    },
  };
};
