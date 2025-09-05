/*
  Warnings:

  - Added the required column `order` to the `chapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chapter" ADD COLUMN     "order" SMALLINT NOT NULL;
