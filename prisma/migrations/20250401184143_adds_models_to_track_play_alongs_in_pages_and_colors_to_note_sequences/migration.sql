-- DropForeignKey
ALTER TABLE
  "page_midi" DROP CONSTRAINT "page_midi_midi_id_fkey";

-- DropForeignKey
ALTER TABLE
  "page_midi" DROP CONSTRAINT "page_midi_page_id_fkey";

-- AlterTable
ALTER TABLE
  "note_sequence"
ADD
  COLUMN "color" VARCHAR(7);

-- DropTable
DROP TABLE "midi";

-- DropTable
DROP TABLE "page_midi";

-- CreateTable
CREATE TABLE "page_play_along" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "play_along_id" UUID NOT NULL,
  "page_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "page_play_along_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE
  "page_play_along"
ADD
  CONSTRAINT "page_play_along_play_along_id_fkey" FOREIGN KEY ("play_along_id") REFERENCES "play_along"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "page_play_along"
ADD
  CONSTRAINT "page_play_along_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;