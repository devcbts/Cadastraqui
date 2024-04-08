/*
  Warnings:

  - You are about to drop the column `CEP` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `UF` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `addressNumber` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `familyMembers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "familyMembers" DROP COLUMN "CEP",
DROP COLUMN "UF",
DROP COLUMN "address",
DROP COLUMN "addressNumber",
DROP COLUMN "city",
DROP COLUMN "neighborhood";
