# Scripts

This directory contains utility scripts for managing the Music Atlas database.

## Database Scripts

### `importScales.ts`

Imports musical scales and chords from CSV files into the database. The script processes multiple CSV files in parallel (with a concurrency limit of 5) and creates `NoteSequence` records with their associated notes.

The script expects CSV files in the `scales/` directory with the following format:

```csv
name,root,type,notes
C Major Scale,C,Major,60;62;64;65;67;69;71;72
```

Where:

- `name`: Unique identifier for the sequence (e.g., "C Major Scale")
- `root`: The root note (e.g., "C", "F#")
- `type`: The type of sequence (e.g., "Major", "Minor", "Diminished")
- `notes`: Semicolon-separated MIDI note numbers

To run:

```bash
doppler run -- bun src/scripts/importScales.ts
```

### `createConceptChapter.ts`

Creates a new chapter from a concept defined in `src/docs/CONCEPTS.md`. The script:

1. Parses the markdown content
2. Extracts the concept's title, content, and associated sequences
3. Creates a new chapter with the content
4. Links all referenced note sequences to the chapter

To run:

```bash
doppler run -- bun src/scripts/createConceptChapter.ts "Concept Name"
```

Examples:

```bash
# Create a chapter about the Major Scale
doppler run -- bun src/scripts/createConceptChapter.ts "Major Scale"

# Create a chapter about Triads
doppler run -- bun src/scripts/createConceptChapter.ts "Triads"
```

### `findSequences.ts`

Searches for note sequences in the database by name. Useful for finding sequence IDs when writing documentation or creating chapters.

To run:

```bash
doppler run -- bun src/scripts/findSequences.ts "search term"
```

Examples:

```bash
# Find all major scales
doppler run -- bun src/scripts/findSequences.ts "Major Scale"

# Find all C chords
doppler run -- bun src/scripts/findSequences.ts "C "

# Find all diminished chords
doppler run -- bun src/scripts/findSequences.ts "Diminished"
```

### Database Backup Scripts

#### `backupUsers.ts`

Backs up user data from the database to a JSON file (`user_backup.json`). Useful before performing database resets or migrations.

To run:

```bash
doppler run -- bun src/scripts/backupUsers.ts
```

#### `restoreUsers.ts`

Restores user data from a backup file (`user_backup.json`) to the database. Use this after resetting the database or applying migrations to preserve user accounts.

To run:

```bash
doppler run -- bun src/scripts/restoreUsers.ts
```

## Common Operations

### Resetting the Database

To completely reset the database while preserving user data:

1. Backup users:

```bash
doppler run -- bun src/scripts/backupUsers.ts
```

2. Reset the database:

```bash
doppler run -- bun prisma migrate reset --force
```

3. Restore users:

```bash
doppler run -- bun src/scripts/restoreUsers.ts
```

4. Import scales (if needed):

```bash
doppler run -- bun src/scripts/importScales.ts
```

## Notes

- All scripts require Doppler for environment variable management
- The scales import script enforces unique names for note sequences
- Scale imports are parallelized for better performance
- CSV files in the `scales/` directory are processed in parallel
- Within each CSV file, records are also processed in parallel (with concurrency limits)
