# Music Atlas API Data Model

This document explains the data model for the Music Atlas API, including the relationships between entities and the rationale behind the design decisions.

## Core Entities

### User

- Represents a user in the system with one of three roles: admin, teacher, or student
- Teachers can create and manage classrooms, chapters, and collections
- Students can join classrooms and track their practice events
- Admins have full system access

### Classroom

- Represents a class taught by a teacher
- Contains students (via ClassroomStudent junction)
- Used for organizing students and tracking their progress

### Chapter

- Represents a musical lesson or unit
- Contains Pages which hold the actual content
- Can be organized into Collections

### Page

- Contains the actual content for a chapter
- Can include text, musical notation, and references to MIDI files and note sequences
- Students record practice events against pages

### Collection

- Groups related chapters together
- Provides a way to organize curriculum

### NoteSequence

- Represents a musical sequence (scales, chords, etc.)
- Contains individual notes with timing information
- Can be associated with Pages via PageNoteSequence

### Midi

- Represents a MIDI file in the system
- Contains metadata and a reference to the actual file
- Can be associated with Pages via PageMidi

## Junction Tables

### ClassroomStudent

- Connects students to classrooms
- Includes soft delete functionality (removedAt)

### CollectionChapter

- Connects chapters to collections
- Includes ordering information

### PageNoteSequence

- Connects note sequences to pages
- Replaced the previous ChapterNoteSequence model when content moved from Chapters to Pages

### PageMidi

- Connects MIDI files to pages
- Replaced the previous ChapterMidi model when content moved from Chapters to Pages

## Event Tracking

### PracticeEvent

- Records when a student practices a specific page
- Used for tracking student progress and engagement

### TeacherInvite

- Manages invitations for new teachers to join the system
- Includes tracking for views, expiration, and consumption

## Recent Data Model Changes

The data model was recently updated to move content from Chapters to Pages:

1. **Content Migration**: Content previously stored directly in Chapters is now stored in Pages, with Chapters serving as containers for Pages.

2. **Relationship Updates**:

   - Removed `ChapterNoteSequence` and `ChapterMidi` junction tables
   - Added `PageNoteSequence` and `PageMidi` junction tables
   - Updated relationships to reflect that Pages (not Chapters) now contain the content

3. **Rationale**:
   - This change allows for more granular content organization
   - Pages can be individually practiced and tracked
   - Chapters now serve as logical groupings of Pages

## Relationship Management

- One-to-many relationships are managed on the "many" side (e.g., Pages belong to Chapters)
- Many-to-many relationships use junction tables (e.g., PageNoteSequence, PageMidi)
- The Page service manages relationships between Pages and NoteSequences/Midis
