-- AlterTable
ALTER TABLE "phrase_bar" ADD COLUMN     "order" SMALLINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "phrase_bar_note" ADD COLUMN     "order" SMALLINT NOT NULL DEFAULT 0;
