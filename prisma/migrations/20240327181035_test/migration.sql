/*
  Warnings:

  - You are about to drop the column `entity_subsidiary_id` on the `Announcement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[responsible_id]` on the table `housing` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "HigherEducationScholarshipType" ADD VALUE 'StateGovernmentPartial';
ALTER TYPE "HigherEducationScholarshipType" ADD VALUE 'CityGovernmentPartial';
ALTER TYPE "HigherEducationScholarshipType" ADD VALUE 'ExternalEntitiesPartial';
ALTER TYPE "HigherEducationScholarshipType" ADD VALUE 'HigherEduInstitutionWorkersPartial';
ALTER TYPE "HigherEducationScholarshipType" ADD VALUE 'PostgraduateStrictoSensuPartial';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ScholarshipOfferType" ADD VALUE 'Law187ScholarshipPartial';
ALTER TYPE "ScholarshipOfferType" ADD VALUE 'StudentWithDisabilityPartial';
ALTER TYPE "ScholarshipOfferType" ADD VALUE 'FullTimePartial';
ALTER TYPE "ScholarshipOfferType" ADD VALUE 'EntityWorkersPartial';

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_entity_subsidiary_id_fkey";

-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_candidate_id_fkey";

-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_familyMember_id_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_candidate_id_fkey";

-- DropForeignKey
ALTER TABLE "FamilyMemberIncome" DROP CONSTRAINT "FamilyMemberIncome_familyMember_id_fkey";

-- DropForeignKey
ALTER TABLE "Financing" DROP CONSTRAINT "Financing_candidate_id_fkey";

-- DropForeignKey
ALTER TABLE "Financing" DROP CONSTRAINT "Financing_familyMember_id_fkey";

-- DropForeignKey
ALTER TABLE "IdentityDetails" DROP CONSTRAINT "IdentityDetails_candidate_id_fkey";

-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_candidate_id_fkey";

-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_familyMember_id_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyIncome" DROP CONSTRAINT "MonthlyIncome_familyMember_id_fkey";

-- DropForeignKey
ALTER TABLE "OtherExpense" DROP CONSTRAINT "OtherExpense_candidate_id_fkey";

-- DropForeignKey
ALTER TABLE "OtherExpense" DROP CONSTRAINT "OtherExpense_familyMember_id_fkey";

-- DropForeignKey
ALTER TABLE "familyMemberDiseases" DROP CONSTRAINT "familyMemberDiseases_familyMember_id_fkey";

-- DropForeignKey
ALTER TABLE "familyMembers" DROP CONSTRAINT "familyMembers_candidate_id_fkey";

-- DropForeignKey
ALTER TABLE "housing" DROP CONSTRAINT "housing_candidate_id_fkey";

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "entity_subsidiary_id",
ADD COLUMN     "announcementBegin" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "number" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ApplicationHistory" ADD COLUMN     "report" TEXT;

-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "legalResponsibleId" TEXT,
ALTER COLUMN "familyMember_id" DROP NOT NULL,
ALTER COLUMN "candidate_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EducationLevel" ADD COLUMN     "entitySubsidiaryId" TEXT;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "legalResponsibleId" TEXT,
ALTER COLUMN "candidate_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FamilyMemberIncome" ADD COLUMN     "candidate_id" TEXT,
ALTER COLUMN "familyMember_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Financing" ADD COLUMN     "legalResponsibleId" TEXT,
ALTER COLUMN "familyMember_id" DROP NOT NULL,
ALTER COLUMN "candidate_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IdentityDetails" ADD COLUMN     "CadUnico" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSevereDesease" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "candidate_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "legalResponsibleId" TEXT,
ALTER COLUMN "familyMember_id" DROP NOT NULL,
ALTER COLUMN "candidate_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyIncome" ADD COLUMN     "candidate_id" TEXT,
ADD COLUMN     "incomeSource" "IncomeSource";

-- AlterTable
ALTER TABLE "OtherExpense" ADD COLUMN     "legalResponsibleId" TEXT,
ALTER COLUMN "familyMember_id" DROP NOT NULL,
ALTER COLUMN "candidate_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ScholarshipGranted" ALTER COLUMN "ScholarshipCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "legalResponsibleId" TEXT;

-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "finishedRegistration" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "addressNumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "familyMemberDiseases" ADD COLUMN     "candidate_id" TEXT,
ADD COLUMN     "diseases" "Disease"[],
ADD COLUMN     "legalResponsibleId" TEXT,
ALTER COLUMN "disease" DROP NOT NULL,
ALTER COLUMN "familyMember_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "familyMembers" ADD COLUMN     "legalResponsibleId" TEXT,
ALTER COLUMN "addressNumber" SET DATA TYPE TEXT,
ALTER COLUMN "candidate_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "housing" ALTER COLUMN "candidate_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "medications" ADD COLUMN     "candidate_id" TEXT,
ADD COLUMN     "legalResponsibleId" TEXT,
ALTER COLUMN "familyMember_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "responsibles" ALTER COLUMN "addressNumber" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "_AnnouncementToEntitySubsidiary" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AnnouncementToEntitySubsidiary_AB_unique" ON "_AnnouncementToEntitySubsidiary"("A", "B");

-- CreateIndex
CREATE INDEX "_AnnouncementToEntitySubsidiary_B_index" ON "_AnnouncementToEntitySubsidiary"("B");

-- CreateIndex
CREATE UNIQUE INDEX "housing_responsible_id_key" ON "housing"("responsible_id");

-- AddForeignKey
ALTER TABLE "IdentityDetails" ADD CONSTRAINT "IdentityDetails_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familyMembers" ADD CONSTRAINT "familyMembers_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familyMembers" ADD CONSTRAINT "familyMembers_legalResponsibleId_fkey" FOREIGN KEY ("legalResponsibleId") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing" ADD CONSTRAINT "housing_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_legalResponsibleId_fkey" FOREIGN KEY ("legalResponsibleId") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMemberIncome" ADD CONSTRAINT "FamilyMemberIncome_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMemberIncome" ADD CONSTRAINT "FamilyMemberIncome_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyIncome" ADD CONSTRAINT "MonthlyIncome_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyIncome" ADD CONSTRAINT "MonthlyIncome_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_legalResponsibleId_fkey" FOREIGN KEY ("legalResponsibleId") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_legalResponsibleId_fkey" FOREIGN KEY ("legalResponsibleId") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financing" ADD CONSTRAINT "Financing_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financing" ADD CONSTRAINT "Financing_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financing" ADD CONSTRAINT "Financing_legalResponsibleId_fkey" FOREIGN KEY ("legalResponsibleId") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_legalResponsibleId_fkey" FOREIGN KEY ("legalResponsibleId") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherExpense" ADD CONSTRAINT "OtherExpense_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherExpense" ADD CONSTRAINT "OtherExpense_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherExpense" ADD CONSTRAINT "OtherExpense_legalResponsibleId_fkey" FOREIGN KEY ("legalResponsibleId") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familyMemberDiseases" ADD CONSTRAINT "familyMemberDiseases_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familyMemberDiseases" ADD CONSTRAINT "familyMemberDiseases_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familyMemberDiseases" ADD CONSTRAINT "familyMemberDiseases_legalResponsibleId_fkey" FOREIGN KEY ("legalResponsibleId") REFERENCES "responsibles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_legalResponsibleId_fkey" FOREIGN KEY ("legalResponsibleId") REFERENCES "responsibles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationLevel" ADD CONSTRAINT "EducationLevel_entitySubsidiaryId_fkey" FOREIGN KEY ("entitySubsidiaryId") REFERENCES "EntitySubsidiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToEntitySubsidiary" ADD CONSTRAINT "_AnnouncementToEntitySubsidiary_A_fkey" FOREIGN KEY ("A") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToEntitySubsidiary" ADD CONSTRAINT "_AnnouncementToEntitySubsidiary_B_fkey" FOREIGN KEY ("B") REFERENCES "EntitySubsidiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
