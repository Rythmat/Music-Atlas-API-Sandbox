-- AlterTable
ALTER TABLE
  "user"
ADD
  COLUMN "password_reset_attempts" SMALLINT NOT NULL DEFAULT 0,
ADD
  COLUMN "password_reset_token" TEXT,
ADD
  COLUMN "password_reset_token_expires_at" TIMESTAMP(3);