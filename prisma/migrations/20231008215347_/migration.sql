/*
  Warnings:

  - The values [Publica,Privada] on the enum `INSTITUTION_TYPE` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `candidateId` to the `housing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('SmallCarsAndUtilities', 'TrucksAndMinibuses', 'Motorcycles');

-- CreateEnum
CREATE TYPE "VehicleSituation" AS ENUM ('PaidOff', 'Financed');

-- CreateEnum
CREATE TYPE "VehicleUsage" AS ENUM ('WorkInstrument', 'NecessaryDisplacement');

-- CreateEnum
CREATE TYPE "Disease" AS ENUM ('ALIENATION_MENTAL', 'CARDIOPATHY_SEVERE', 'BLINDNESS', 'RADIATION_CONTAMINATION', 'PARKINSONS_DISEASE', 'ANKYLOSING_SPONDYLITIS', 'PAGETS_DISEASE', 'HANSENS_DISEASE', 'SEVERE_HEPATOPATHY', 'SEVERE_NEPHROPATHY', 'PARALYSIS', 'ACTIVE_TUBERCULOSIS', 'HIV_AIDS', 'MALIGNANT_NEOPLASM', 'TERMINAL_STAGE', 'MICROCEPHALY', 'AUTISM_SPECTRUM_DISORDER', 'RARE_DISEASE', 'OTHER_HIGH_COST_DISEASE');

-- AlterEnum
BEGIN;
CREATE TYPE "INSTITUTION_TYPE_new" AS ENUM ('Public', 'Private');
ALTER TABLE "registerDetails" ALTER COLUMN "institutionType" TYPE "INSTITUTION_TYPE_new" USING ("institutionType"::text::"INSTITUTION_TYPE_new");
ALTER TYPE "INSTITUTION_TYPE" RENAME TO "INSTITUTION_TYPE_old";
ALTER TYPE "INSTITUTION_TYPE_new" RENAME TO "INSTITUTION_TYPE";
DROP TYPE "INSTITUTION_TYPE_old";
COMMIT;

-- AlterTable
ALTER TABLE "housing" ADD COLUMN     "candidateId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "hasVehicle" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER DEFAULT 1,
    "ownerId" TEXT NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "modelAndBrand" TEXT,
    "manufacturingYear" INTEGER,
    "situation" "VehicleSituation" NOT NULL,
    "hasInsurance" BOOLEAN NOT NULL DEFAULT false,
    "insuranceValue" DOUBLE PRECISION,
    "usage" "VehicleUsage" NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMemberIncome" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "hiringDate" TIMESTAMP(3) NOT NULL,
    "position" TEXT NOT NULL,
    "payerDetails" TEXT NOT NULL,
    "employerOrGovernment" TEXT NOT NULL,
    "employerPhone" TEXT NOT NULL,
    "receivesOvertime" BOOLEAN NOT NULL,
    "familyMemberId" TEXT NOT NULL,

    CONSTRAINT "FamilyMemberIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "familyMemberIncomeId" TEXT NOT NULL,
    "value" DECIMAL(65,30),
    "index" INTEGER NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyIncome" (
    "id" TEXT NOT NULL,
    "familyMemberIncomeId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "grossAmount" DECIMAL(65,30) NOT NULL,
    "hadDeduction" BOOLEAN NOT NULL,
    "deductionValue" DECIMAL(65,30),
    "publicPension" DECIMAL(65,30),
    "incomeTax" DECIMAL(65,30),
    "otherDeductions" DECIMAL(65,30),
    "foodAllowance" BOOLEAN NOT NULL,
    "foodAllowanceValue" DECIMAL(65,30),
    "transportAllowance" BOOLEAN NOT NULL,
    "transportAllowanceValue" DECIMAL(65,30),
    "expenseReimbursement" BOOLEAN NOT NULL,
    "expenseReimbursementValue" DECIMAL(65,30),
    "advancePayment" BOOLEAN NOT NULL,
    "advancePaymentValue" DECIMAL(65,30),
    "reversals" BOOLEAN NOT NULL,
    "reversalValue" DECIMAL(65,30),
    "compensation" BOOLEAN NOT NULL,
    "compensationValue" DECIMAL(65,30),
    "judicialPension" BOOLEAN NOT NULL,
    "judicialPensionValue" DECIMAL(65,30),

    CONSTRAINT "MonthlyIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "waterSewage" DOUBLE PRECISION,
    "electricity" DOUBLE PRECISION,
    "landlinePhone" DOUBLE PRECISION,
    "mobilePhone" DOUBLE PRECISION,
    "food" DOUBLE PRECISION,
    "rent" DOUBLE PRECISION,
    "garageRent" DOUBLE PRECISION,
    "condominium" DOUBLE PRECISION,
    "cableTV" DOUBLE PRECISION,
    "streamingServices" DOUBLE PRECISION,
    "fuel" DOUBLE PRECISION,
    "annualIPVA" DOUBLE PRECISION,
    "optedForInstallment" BOOLEAN,
    "installmentCount" INTEGER,
    "installmentValue" DOUBLE PRECISION,
    "annualIPTU" DOUBLE PRECISION,
    "annualITR" DOUBLE PRECISION,
    "annualIR" DOUBLE PRECISION,
    "INSS" DOUBLE PRECISION,
    "publicTransport" DOUBLE PRECISION,
    "schoolTransport" DOUBLE PRECISION,
    "internet" DOUBLE PRECISION,
    "courses" DOUBLE PRECISION,
    "healthPlan" DOUBLE PRECISION,
    "dentalPlan" DOUBLE PRECISION,
    "medicationExpenses" DOUBLE PRECISION,
    "otherExpenses" DOUBLE PRECISION,
    "totalExpense" DOUBLE PRECISION,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "familyMemberName" TEXT NOT NULL,
    "installmentValue" DOUBLE PRECISION NOT NULL,
    "totalInstallments" INTEGER NOT NULL,
    "paidInstallments" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financing" (
    "id" TEXT NOT NULL,
    "familyMemberName" TEXT NOT NULL,
    "financingType" TEXT NOT NULL,
    "installmentValue" DOUBLE PRECISION NOT NULL,
    "totalInstallments" INTEGER NOT NULL,
    "paidInstallments" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "Financing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "familyMemberName" TEXT NOT NULL,
    "usersCount" INTEGER NOT NULL,
    "cardType" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "cardFlag" TEXT NOT NULL,
    "invoiceValue" DOUBLE PRECISION NOT NULL,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherExpense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "OtherExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familyMemberDiseases" (
    "id" TEXT NOT NULL,
    "familyMember_id" TEXT NOT NULL,
    "disease" "Disease" NOT NULL,
    "specificDisease" TEXT,
    "hasMedicalReport" BOOLEAN NOT NULL,

    CONSTRAINT "familyMemberDiseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" TEXT NOT NULL,
    "familyMemberDisease_id" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "obtainedPublicly" BOOLEAN NOT NULL,
    "specificMedicationPublicly" TEXT,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "housing" ADD CONSTRAINT "housing_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMemberIncome" ADD CONSTRAINT "FamilyMemberIncome_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_familyMemberIncomeId_fkey" FOREIGN KEY ("familyMemberIncomeId") REFERENCES "FamilyMemberIncome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyIncome" ADD CONSTRAINT "MonthlyIncome_familyMemberIncomeId_fkey" FOREIGN KEY ("familyMemberIncomeId") REFERENCES "FamilyMemberIncome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financing" ADD CONSTRAINT "Financing_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherExpense" ADD CONSTRAINT "OtherExpense_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familyMemberDiseases" ADD CONSTRAINT "familyMemberDiseases_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_familyMemberDisease_id_fkey" FOREIGN KEY ("familyMemberDisease_id") REFERENCES "familyMemberDiseases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
