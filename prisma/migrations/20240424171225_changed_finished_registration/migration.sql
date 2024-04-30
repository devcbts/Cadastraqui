/*
  Warnings:

  - You are about to drop the column `finishedRegistration` on the `candidates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "CadUnico" BOOLEAN,
ADD COLUMN     "hasSevereDesease" BOOLEAN,
ADD COLUMN     "position" INTEGER;

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "finishedRegistration",
ADD COLUMN     "finishedapplication" BOOLEAN NOT NULL DEFAULT false;
