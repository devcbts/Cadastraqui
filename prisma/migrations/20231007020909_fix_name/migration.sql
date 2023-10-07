/*
  Warnings:

  - You are about to drop the column `street` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - Added the required column `addressStreet` to the `EntitySubsidiary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntitySubsidiary" DROP COLUMN "street",
ADD COLUMN     "addressStreet" TEXT NOT NULL;
