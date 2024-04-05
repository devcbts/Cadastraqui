/*
  Warnings:

  - You are about to drop the column `neighoborhood` on the `EntitySubsidiary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EntitySubsidiary" DROP COLUMN "neighoborhood",
ADD COLUMN     "neighborhood" TEXT DEFAULT '';
