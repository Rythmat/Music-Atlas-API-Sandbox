/*
 Warnings:
 
 - You are about to drop the column `duration` on the `note` table. All the data in the column will be lost.
 - You are about to drop the column `start` on the `note` table. All the data in the column will be lost.
 - Added the required column `startOffset` to the `note` table without a default value. This is not possible if the table is not empty.
 
 */
-- CreateEnum
CREATE TYPE "note_type" AS ENUM (
  'whole',
  'half',
  'quarter',
  'eighth',
  'sixteenth',
  'thirtysecond',
  'dotted_whole',
  'dotted_half',
  'dotted_quarter',
  'dotted_eighth',
  'dotted_sixteenth'
);

-- AlterTable
ALTER TABLE
  "note" DROP COLUMN "duration",
  DROP COLUMN "start",
ADD
  COLUMN "note_type" "note_type" NOT NULL DEFAULT 'quarter',
ADD
  COLUMN "startOffset" DOUBLE PRECISION NOT NULL;