/*
  Warnings:

  - You are about to drop the `play_along_audio_track` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `play_along_midi_track` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "play_along_audio_track" DROP CONSTRAINT "play_along_audio_track_play_along_id_fkey";

-- DropForeignKey
ALTER TABLE "play_along_midi_track" DROP CONSTRAINT "play_along_midi_track_play_along_id_fkey";

-- AlterTable
ALTER TABLE "phrase_bar_note" ADD COLUMN     "label" TEXT;

-- AlterTable
ALTER TABLE "play_along" ADD COLUMN     "audio_file_path" TEXT,
ADD COLUMN     "midi_beats_per_minute" SMALLINT,
ADD COLUMN     "midi_file_path" TEXT;

-- DropTable
DROP TABLE "play_along_audio_track";

-- DropTable
DROP TABLE "play_along_midi_track";

-- DropEnum
DROP TYPE "play_along_track_instrument_type";
