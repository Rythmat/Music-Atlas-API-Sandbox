# Music Atlas API Services

This directory contains the service layer for the Music Atlas API. Each service is responsible for handling a specific domain entity and provides CRUDL (Create, Read, Update, Delete, List) operations as well as additional specialized operations as needed.

## Service Organization

Services are organized by domain entity, with each entity having its own directory containing individual files for each operation. This structure makes it easy to locate and maintain specific functionality.

## Common Service Patterns

### CRUDL Operations

Each entity service typically provides the following operations:

- **Create**: Creates a new entity
- **Read**: Retrieves a single entity by ID
- **Update**: Updates an existing entity
- **Delete**: Deletes an entity (or soft-deletes it by setting a removal timestamp)
- **List**: Retrieves a list of entities, often with filtering and pagination

### Relationship Management

- **One-to-Many Relationships**: Managed on the "many" side (e.g., Pages belong to Chapters)
- **Many-to-Many Relationships**: Managed by the parent entity (e.g., Page service manages PageNoteSequence and PageMidi relationships)

### Response Format

All services return the entity or entities requested, with related entities included as needed. For example, when retrieving a Page, its related NoteSequences and MIDIs are included in the response.

## Service Directories

### Auth Services (`/auth`)

Authentication and user management services.

- `create-user.ts`: Register a new user
- `get-me.ts`: Get the current authenticated user
- `login.ts`: Authenticate a user and generate a session

### Chapter Services (`/chapter`)

Chapter management services.

- `create-chapter.ts`: Create a new chapter
- `delete-chapter.ts`: Delete a chapter
- `get-chapter.ts`: Get a chapter by ID
- `list-chapters.ts`: List chapters with filtering
- `update-chapter.ts`: Update a chapter

### Classroom Services (`/classroom`)

Classroom management services.

- `create-classroom.ts`: Create a new classroom
- `get-classrooms.ts`: Get classrooms for a teacher
- `join-classroom.ts`: Add a student to a classroom
- `list-classrooms.ts`: List all classrooms
- `remove-classroom-student.ts`: Remove a student from a classroom (consider moving to students service)
- `restore-classroom-student.ts`: Restore a previously removed student (consider moving to students service)
- `update-classroom.ts`: Update a classroom

### Collection Services (`/collection`)

Collection management services.

- `create-collection.ts`: Create a new collection
- `delete-collection.ts`: Delete a collection
- `get-collection.ts`: Get a collection by ID
- `list-collections.ts`: List collections
- `update-collection.ts`: Update a collection

### Invitation Services (`/invitation`)

Services for managing teacher invitations.

- `create-teacher-invitation.ts`: Create an invitation for a new teacher
- `get-teacher-invitation.ts`: Get an invitation by code
- `list-teacher-invitations.ts`: List all invitations
- `revoke-teacher-invitation.ts`: Revoke an invitation

### MIDI Services (`/midi`)

MIDI file management services.

- `create-midi.ts`: Create a new MIDI file record
- `delete-midi.ts`: Delete a MIDI file
- `get-upload-url.ts`: Get a signed URL for uploading a MIDI file
- `list-midis.ts`: List MIDI files

### Note Sequence Services (`/note-sequence`)

Note sequence management services.

- `create-note-sequence.ts`: Create a new note sequence
- `delete-note-sequence.ts`: Delete a note sequence
- `get-note-sequence.ts`: Get a note sequence by ID
- `list-note-sequences.ts`: List note sequences
- `update-note-sequence.ts`: Update a note sequence

### Page Services (`/page`)

Page management services.

- `create-page.ts`: Create a new page
- `delete-page.ts`: Delete a page
- `get-page.ts`: Get a page by ID
- `list-pages.ts`: List pages for a chapter
- `reorder-pages.ts`: Reorder pages within a chapter
- `update-page.ts`: Update a page

The Page service also manages relationships with NoteSequences and MIDIs through the PageNoteSequence and PageMidi junction tables.

### Practice Event Services (`/practice-event`)

Services for tracking student practice events.

- `create-practice-event.ts`: Record a new practice event
- `list-practice-events.ts`: List practice events for a student or page

### Student Services (`/students`)

Student management services.

- `get-student.ts`: Get a student by ID
- `list-students.ts`: List all students with optional filtering by classroom
- `remove-student.ts`: Soft-delete a student
- `restore-student.ts`: Restore a previously removed student
- `update-student.ts`: Update a student's details

### Teacher Services (`/teachers`)

Teacher management services.

- `list-teachers.ts`: List all teachers
- `remove-teacher.ts`: Soft-delete a teacher
- `restore-teacher.ts`: Restore a previously removed teacher

## Recent Changes

The service layer was recently updated to reflect changes in the data model and API design:

1. **Content Organization**:

   - Content moved from Chapters to Pages
   - Relationships with NoteSequences and MIDIs now managed at the Page level

2. **API Standardization**:

   - PATCH for updates (instead of PUT)
   - DELETE for soft deletes (instead of POST with action)
   - Resource-based routes instead of action-based routes

3. **Relationship Management**:

   - Collection-Chapter relationships moved to Collection service
   - Student listing with classroom filtering moved to Student service
   - Consistent pattern for managing relationships through parent entities

4. **Removed Services**:
   - Collection-Chapter service directory removed (functionality moved to Collection service)
