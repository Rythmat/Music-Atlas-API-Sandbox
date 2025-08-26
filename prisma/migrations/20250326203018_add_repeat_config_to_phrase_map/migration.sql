-- AlterTable
ALTER TABLE "phrase_map" ADD COLUMN     "repeat_count" SMALLINT NOT NULL DEFAULT 1,
ADD COLUMN     "should_loop" BOOLEAN NOT NULL DEFAULT false;
