// call prisma generate but quietly

import { exec } from 'child_process';

exec('prisma generate', (error, stdout, stderr) => {
  if (error) {
    console.log('error', error);
    console.log('stdout', stdout);
    console.log('stderr', stderr);
    return;
  }
  console.log('🗄️  Prisma client generated successfully!');
});
