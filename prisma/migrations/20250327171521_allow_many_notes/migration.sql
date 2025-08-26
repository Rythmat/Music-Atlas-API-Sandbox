-- AlterTable
-- First, add the new column allowing NULL temporarily
ALTER TABLE
  "phrase_bar_note"
ADD
  COLUMN "note_numbers" JSONB;

-- Convert data: put each note_number into a JSON array
UPDATE
  "phrase_bar_note"
SET
  "note_numbers" = json_build_array("note_number");

-- Make the new column NOT NULL now that it has data
ALTER TABLE
  "phrase_bar_note"
ALTER COLUMN
  "note_numbers"
SET
  NOT NULL;

-- Finally drop the old column
ALTER TABLE
  "phrase_bar_note" DROP COLUMN "note_number";