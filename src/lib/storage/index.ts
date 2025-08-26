import { Storage } from '@google-cloud/storage';
import { Env } from '@/constants';

const storageBase = new Storage({
  projectId: Env.get('GCP_STORAGE_PROJECT_ID'),
  credentials: {
    client_email: Env.get('GCP_STORAGE_CLIENT_EMAIL'),
    private_key: Env.get('GCP_STORAGE_PRIVATE_KEY'),
  },
});

export const bucket = storageBase.bucket(Env.get('GCP_STORAGE_BUCKET'));

export const storage = {
  storage: storageBase,
  bucket,
};
