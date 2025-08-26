/*
  Warnings:

  - You are about to drop the column `repeat_count` on the `phrase_map` table. All the data in the column will be lost.
  - You are about to drop the column `should_loop` on the `phrase_map` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "phrase_bar" ADD COLUMN     "end_repeat" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "start_repeat" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "phrase_map" DROP COLUMN "repeat_count",
DROP COLUMN "should_loop";
