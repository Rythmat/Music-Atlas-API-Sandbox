import { storage } from '@/lib/storage';
// Import required for error handling

/**
 * Configure CORS for the storage bucket
 *
 * Usage: npm run set-cors <method> <origin>
 * Example: npm run set-cors PUT http://localhost:3000
 *
 * @param args Command line arguments [method, origin]
 */
async function configureBucketCors(args: string[] = []) {
  // Default allowed HTTP methods
  const methods = ['GET', 'POST', 'PUT'];

  // Default allowed origins
  const allowedOrigins: string[] = [
    'https://app.musicatlas.io',
    'https://music-atlas-webapp.vercel.app',
  ];

  // Add custom origin if provided
  if (args[0] && !allowedOrigins.includes(args[0])) {
    allowedOrigins.push(args[0]);
  }

  if (!allowedOrigins.length) {
    throw new Error('No allowed origins provided');
  }

  // Log configuration using console.info
  console.info(`Configuring CORS for storage bucket:`);
  console.info(`- Methods: ${methods.join(', ')}`);
  console.info(`- Origins: ${allowedOrigins.join(', ')}`);

  await storage.bucket.setCorsConfiguration([
    {
      maxAgeSeconds: 3600,
      method: methods,
      origin: allowedOrigins,
      responseHeader: [
        'Content-Type',
        'Access-Control-Allow-Origin',
        'Authorization',
        'Content-Length',
        'User-Agent',
        'x-goog-*',
      ],
    },
  ]);

  console.info('Storage bucket CORS configuration updated successfully!');
}

// Get arguments from command line (skip the first two: node and script path)
const args = process.argv.slice(2);

configureBucketCors(args).catch((error) => {
  // Error message printed to stderr
  process.stderr.write(`Failed to configure bucket CORS: ${error}\n`);
  process.exit(1);
});
