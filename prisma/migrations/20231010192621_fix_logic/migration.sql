/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `IdentityDetails` table. All the data in the column will be lost.
  - Added the required column `birthDate` to the `IdentityDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IdentityDetails" DROP COLUMN "dateOfBirth",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL;
