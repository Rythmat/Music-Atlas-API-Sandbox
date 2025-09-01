type EnvKey =
  // App
  | 'APP_URL'

  // Sentry
  // | 'SENTRY_DSN'
  // | 'SENTRY_ENVIRONMENT'

  // Vercel
  | 'VERCEL_URL'
  | 'PORT'

  // Google Cloud Storage
  | 'GCP_STORAGE_PROJECT_ID'
  | 'GCP_STORAGE_CLIENT_EMAIL'
  | 'GCP_STORAGE_PRIVATE_KEY'
  | 'GCP_STORAGE_BUCKET'

  // JWT
  | 'JWT_SECRET'

  // Resend
  // | 'RESEND_FROM_EMAIL'
  // | 'RESEND_API_KEY';

export const Env = {
  /**
   * Get an environment variable.
   * @param key - The key of the environment variable.
   * @param options - The options for the environment variable.
   * @returns The environment variable.
   */
  get: (key: EnvKey) => {
    const envKey = process.env[key];

    if (!envKey) {
      throw new Error(`Missing env variable for key: ${key}`);
    }

    return envKey;
  },

  /**
   * Get an optional environment variable.
   * @param key - The key of the environment variable.
   * @returns The environment variable or null if it is not set.
   */
  getOptional: (key: EnvKey) => {
    return process.env[key] || null;
  },

  /**
   * Check if the environment is production.
   * @returns True if the environment is production, false otherwise.
   */
  isProduction: () => process.env.NODE_ENV === 'production',

  /**
   * Check if the environment is development.
   * @returns True if the environment is development, false otherwise.
   */
  isDevelopment: () => process.env.NODE_ENV !== 'production',
};
