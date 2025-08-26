-- CreateEnum
CREATE TYPE "play_along_track_instrument_type" AS ENUM ('piano', 'guitar', 'bass', 'drums', 'other');

-- CreateTable
CREATE TABLE "play_along" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "play_along_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "play_along_midi_track" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "color" VARCHAR(7),
    "file_path" TEXT NOT NULL,
    "instrument_type" "play_along_track_instrument_type" NOT NULL DEFAULT 'other',
    "play_along_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "play_along_midi_track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "play_along_audio_track" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "play_along_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "play_along_audio_track_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE
    "play_along_midi_track"
ADD
    CONSTRAINT "play_along_midi_track_play_along_id_fkey" FOREIGN KEY ("play_along_id") REFERENCES "play_along"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "play_along_audio_track"
ADD
    CONSTRAINT "play_along_audio_track_play_along_id_fkey" FOREIGN KEY ("play_along_id") REFERENCES "play_along"("id") ON DELETE RESTRICT ON UPDATE CASCADE;