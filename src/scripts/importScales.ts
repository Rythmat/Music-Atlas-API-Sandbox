import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';
import throat from 'throat';

const prisma = new PrismaClient();
const CONCURRENCY_LIMIT = 5;

interface ScaleData {
  name: string;
  root: string;
  type: string;
  notes: string; // Semicolon-separated MIDI note numbers
}

async function importScalesFromCsv(filePath: string): Promise<void> {
  console.info(`Importing scales from ${filePath}...`);

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = Papa.parse<ScaleData>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const importPromises = data.map(
    throat(CONCURRENCY_LIMIT, async (record) => {
      const { name, root, type, notes } = record;
      const noteNumbers = notes.split(';').map((n) => parseInt(n, 10));

      // Create a NoteSequence for this scale
      const noteSequence = await prisma.noteSequence.create({
        data: {
          name,
          root,
          type,
          tempo: 120, // Default tempo
          timeSignature: '4/4', // Default time signature
          ticksPerBeat: 480, // Standard MIDI resolution
          Notes: {
            create: noteNumbers.map((noteNumber, index) => ({
              noteNumber,
              startTimeInTicks: index * 480, // One note per beat
              durationInTicks: 480, // Quarter note duration
              velocity: 80, // Medium velocity
            })),
          },
        },
      });

      console.info(
        `Created NoteSequence for ${name} with ID: ${noteSequence.id}`,
      );
    }),
  );

  await Promise.all(importPromises);
}

async function main() {
  try {
    const scalesDir = path.join(__dirname, 'scales');
    const scaleFiles = fs
      .readdirSync(scalesDir)
      .filter((file) => file.endsWith('.csv'));

    const fileImportPromises = scaleFiles.map(
      throat(CONCURRENCY_LIMIT, async (file) => {
        await importScalesFromCsv(path.join(scalesDir, file));
      }),
    );

    await Promise.all(fileImportPromises);
    console.info('All scales imported successfully!');
  } catch (error) {
    console.error('Error importing scales:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
