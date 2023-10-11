/*
  Warnings:

  - You are about to drop the column `age` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `birthRegistrationBook` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `birthRegistrationNumber` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `birthRegistrationPage` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `incomeSource` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `mobilePhone` on the `familyMembers` table. All the data in the column will be lost.
  - You are about to drop the column `nis` on the `familyMembers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[RG]` on the table `familyMembers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CEP` to the `familyMembers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UF` to the `familyMembers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `familyMembers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressNumber` to the `familyMembers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `natural_UF` to the `familyMembers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `natural_city` to the `familyMembers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `familyMembers` table without a default value. This is not possible if the table is not empty.
  - Made the column `city` on table `familyMembers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rgIssuingAuthority` on table `familyMembers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rgIssuingState` on table `familyMembers` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `educationLevel` on the `familyMembers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `CPF` on table `familyMembers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `RG` on table `familyMembers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "familyMembers" DROP COLUMN "age",
DROP COLUMN "birthRegistrationBook",
DROP COLUMN "birthRegistrationNumber",
DROP COLUMN "birthRegistrationPage",
DROP COLUMN "country",
DROP COLUMN "incomeSource",
DROP COLUMN "mobilePhone",
DROP COLUMN "nis",
ADD COLUMN     "CEP" TEXT NOT NULL,
ADD COLUMN     "NIS" TEXT,
ADD COLUMN     "UF" "COUNTRY" NOT NULL,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "addressNumber" INTEGER NOT NULL,
ADD COLUMN     "bookOfBirthRegister" TEXT,
ADD COLUMN     "coursingEducationLevel" "EDUCATION_TYPE",
ADD COLUMN     "cycleOfEducation" TEXT,
ADD COLUMN     "educationPlace" "INSTITUTION_TYPE",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "hasScholarship" BOOLEAN,
ADD COLUMN     "institutionName" TEXT,
ADD COLUMN     "monthlyAmount" TEXT,
ADD COLUMN     "natural_UF" "COUNTRY" NOT NULL,
ADD COLUMN     "natural_city" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "numberOfBirthRegister" TEXT,
ADD COLUMN     "pageOfBirthRegister" TEXT,
ADD COLUMN     "percentageOfScholarship" TEXT,
ADD COLUMN     "socialname" TEXT,
ADD COLUMN     "turnOfEducation" "SHIFT",
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "rgIssuingAuthority" SET NOT NULL,
ALTER COLUMN "rgIssuingState" SET NOT NULL,
DROP COLUMN "educationLevel",
ADD COLUMN     "educationLevel" "SCHOLARSHIP" NOT NULL,
ALTER COLUMN "CPF" SET NOT NULL,
ALTER COLUMN "RG" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "familyMembers_RG_key" ON "familyMembers"("RG");
