-- CreateEnum
CREATE TYPE "phrase_bar_note_type" AS ENUM ('note', 'rest');

-- CreateEnum
CREATE TYPE "phrase_bar_note_duration" AS ENUM (
    'whole',
    'half',
    'quarter',
    'eighth',
    'sixteenth'
);

-- CreateTable
CREATE TABLE "phrase_map" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT,
    "description" TEXT,
    "color" VARCHAR(7),
    "beats_per_minute" SMALLINT NOT NULL DEFAULT 60,
    "beats_per_bar" SMALLINT NOT NULL DEFAULT 16,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "phrase_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phrase_bar" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT,
    "color" VARCHAR(7),
    "phrase_map_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "phrase_bar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phrase_bar_note" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "note_type" "phrase_bar_note_type" NOT NULL DEFAULT 'note',
    "note_number" SMALLINT NOT NULL,
    "note_duration" "phrase_bar_note_duration" NOT NULL DEFAULT 'quarter',
    "color" VARCHAR(7),
    "phrase_bar_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "phrase_bar_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phrase_page" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phrase_map_id" UUID NOT NULL,
    "page_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "phrase_page_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE
    "phrase_bar"
ADD
    CONSTRAINT "phrase_bar_phrase_map_id_fkey" FOREIGN KEY ("phrase_map_id") REFERENCES "phrase_map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "phrase_bar_note"
ADD
    CONSTRAINT "phrase_bar_note_phrase_bar_id_fkey" FOREIGN KEY ("phrase_bar_id") REFERENCES "phrase_bar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "phrase_page"
ADD
    CONSTRAINT "phrase_page_phrase_map_id_fkey" FOREIGN KEY ("phrase_map_id") REFERENCES "phrase_map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "phrase_page"
ADD
    CONSTRAINT "phrase_page_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;