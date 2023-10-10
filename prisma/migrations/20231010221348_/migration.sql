/*
  Warnings:

  - You are about to drop the column `socialname` on the `familyMembers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "familyMembers" DROP COLUMN "socialname",
ADD COLUMN     "socialName" TEXT;
