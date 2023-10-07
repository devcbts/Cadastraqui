/*
  Warnings:

  - You are about to drop the column `cpf` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `rg` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `CPF` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `UF` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `addressCity` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `addressState` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `complement` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `registerDetails` table. All the data in the column will be lost.
  - You are about to drop the column `streetNumber` on the `registerDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[CPF]` on the table `familyMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "familyMembers_cpf_key";

-- DropIndex
DROP INDEX "registerDetails_CPF_key";

-- DropIndex
DROP INDEX "registerDetails_email_key";

-- AlterTable
ALTER TABLE "familyMembers" DROP COLUMN "cpf",
DROP COLUMN "rg",
DROP COLUMN "state",
ADD COLUMN     "CPF" TEXT,
ADD COLUMN     "RG" TEXT,
ADD COLUMN     "country" TEXT;

-- AlterTable
ALTER TABLE "registerDetails" DROP COLUMN "CPF",
DROP COLUMN "UF",
DROP COLUMN "addressCity",
DROP COLUMN "addressState",
DROP COLUMN "birthDate",
DROP COLUMN "city",
DROP COLUMN "complement",
DROP COLUMN "email",
DROP COLUMN "neighborhood",
DROP COLUMN "password",
DROP COLUMN "postalCode",
DROP COLUMN "street",
DROP COLUMN "streetNumber";

-- CreateIndex
CREATE UNIQUE INDEX "familyMembers_CPF_key" ON "familyMembers"("CPF");
