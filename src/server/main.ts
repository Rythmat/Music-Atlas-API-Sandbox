import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import packageJson from '@/../package.json';
import { authController } from './controllers/auth';
import { chapterController } from './controllers/chapter';
import { classroomController } from './controllers/classroom';
import { collectionController } from './controllers/collection';
import { invitationController } from './controllers/invitation';
import { mediaController } from './controllers/media';
import { noteSequenceController } from './controllers/note-sequence';
import { notesController } from './controllers/notes';
import { pageController } from './controllers/page';
import { phraseMapController } from './controllers/phrase-maps';
import { playAlongController } from './controllers/play-along';
import { practiceEventController } from './controllers/practice-event';
import { studentController } from './controllers/student';
import { teacherController } from './controllers/teacher';
import { tuneController } from './controllers/tune';
// import { sentry } from './sentry';
import { serializeResponse } from './superJson';


const WEBAPP_ORIGIN = process.env.WEBAPP_ORIGIN ?? 'https://music-atlas-webapp-sandbox-h43ol6h06-musicatlas.vercel.app/';
const DEV_ORIGIN = 'http://localhost:5173';
const ALLOWED_ORIGINS = [WEBAPP_ORIGIN, DEV_ORIGIN].filter(Boolean);
const isAllowed = (origin?: string | null) => !!origin && ALLOWED_ORIGINS.includes(origin);



export const server = new Elysia()

  .use(cors({
    origin: (origin) => isAllowed(origin),
    credentials: true, // if you use cookies/sessions
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  }))

  .options('/*', ({ request, set }) => {
    const origin = request.headers.get('origin');
    const reqHeaders = request.headers.get('access-control-request-headers') ?? 'Content-Type, Authorization';

    if (isAllowed(origin)) {
      set.headers['Access-Control-Allow-Origin'] = origin!;
      set.headers['Access-Control-Allow-Credentials'] = 'true';
      set.headers['Vary'] = 'Origin';
    }
    set.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';
    set.headers['Access-Control-Allow-Headers'] = reqHeaders;
    set.status = 204; // No content for preflight
  })

  // .use(sentry())
  .onAfterHandle(serializeResponse)
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Music Atlas API',
          version: packageJson.version,
          description: 'API for the Music Atlas app',
        },
        tags: [
          {
            name: 'Auth',
            description: 'Authentication and user management endpoints',
          },
          {
            name: 'Chapters',
            description: 'Chapter management endpoints (containers for Pages)',
          },
          { name: 'Classrooms', description: 'Classroom management endpoints' },
          {
            name: 'Collections',
            description:
              'Collection management endpoints including chapter relationships',
          },
          {
            name: 'Invitations',
            description: 'Teacher invitation management endpoints',
          },
          {
            name: 'Media',
            description: 'Media upload endpoints',
          },
          {
            name: 'Notes',
            description: 'Note management endpoints',
          },
          {
            name: 'Note Sequences',
            description: 'Note sequence management endpoints with notes',
          },
          {
            name: 'MIDI Files',
            description: 'MIDI file upload and management endpoints',
          },
          {
            name: 'Pages',
            description:
              'Page management endpoints with note sequence and MIDI relationships',
          },
          {
            name: 'Play-Along',
            description: 'Play-along management endpoints',
          },
          {
            name: 'Practice Events',
            description: 'Student practice tracking endpoints',
          },
          {
            name: 'Phrase Maps',
            description: 'Phrase map management endpoints',
          },
          {
            name: 'Students',
            description:
              'Student management endpoints with CRUD operations and classroom filtering',
          },
          {
            name: 'Teachers',
            description:
              'Teacher management endpoints with soft delete support',
          },
          {
            name: 'Tunes',
            description: 'Tune and measure management endpoints',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    }),
  )
  .get('/', () => 'Ba Dum Tss', {
    detail: {
      hide: true,
    },
  })
  .use(authController)
  .use(chapterController)
  .use(classroomController)
  .use(collectionController)
  .use(invitationController)
  .use(notesController)
  .use(noteSequenceController)
  .use(pageController)
  .use(phraseMapController)
  .use(playAlongController)
  .use(practiceEventController)
  .use(studentController)
  .use(teacherController)
  .use(tuneController)
  .use(mediaController);
