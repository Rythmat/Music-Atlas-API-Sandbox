import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findSequences(searchTerm: string) {
  try {
    const sequences = await prisma.noteSequence.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        root: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (sequences.length === 0) {
      console.info('No sequences found matching:', searchTerm);
      return;
    }

    console.info('\nFound sequences:');
    sequences.forEach((seq) => {
      console.info(
        `\n"_component:sequence(${seq.id}, piano)_"\n${seq.name} (${seq.root} ${seq.type})`,
      );
    });
  } catch (error) {
    console.error('Error searching sequences:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get search term from command line arguments
const searchTerm = process.argv[2];

if (!searchTerm) {
  console.error('Please provide a search term');
  process.exit(1);
}

findSequences(searchTerm);
