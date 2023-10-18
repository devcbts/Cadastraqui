/*
  Warnings:

  - You are about to drop the column `familyMemberId` on the `FamilyMemberIncome` table. All the data in the column will be lost.
  - You are about to drop the column `advancePayment` on the `MonthlyIncome` table. All the data in the column will be lost.
  - You are about to drop the column `compensation` on the `MonthlyIncome` table. All the data in the column will be lost.
  - You are about to drop the column `expenseReimbursement` on the `MonthlyIncome` table. All the data in the column will be lost.
  - You are about to drop the column `familyMemberIncomeId` on the `MonthlyIncome` table. All the data in the column will be lost.
  - You are about to drop the column `foodAllowance` on the `MonthlyIncome` table. All the data in the column will be lost.
  - You are about to drop the column `judicialPension` on the `MonthlyIncome` table. All the data in the column will be lost.
  - You are about to drop the column `reversals` on the `MonthlyIncome` table. All the data in the column will be lost.
  - You are about to drop the column `transportAllowance` on the `MonthlyIncome` table. All the data in the column will be lost.
  - You are about to drop the column `familyMemberIncomeId` on the `Salary` table. All the data in the column will be lost.
  - You are about to drop the column `familyMemberDisease_id` on the `medications` table. All the data in the column will be lost.
  - Added the required column `familyMember_id` to the `FamilyMemberIncome` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `occupation` on the `FamilyMemberIncome` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `familyMemberIncome_id` to the `MonthlyIncome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liquidAmount` to the `MonthlyIncome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `familyMemberIncome_id` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `familyMember_id` to the `medications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('PRIVATE_EMPLOYEE_CLT', 'PUBLIC_EMPLOYEE', 'DOMESTIC_EMPLOYEE', 'TEMPORARY_RURAL_WORKER', 'RETIRED', 'PENSIONER', 'APPRENTICE_INTERN', 'TEMPORARY_DISABILITY_BENEFIT');

-- DropForeignKey
ALTER TABLE "FamilyMemberIncome" DROP CONSTRAINT "FamilyMemberIncome_familyMemberId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyIncome" DROP CONSTRAINT "MonthlyIncome_familyMemberIncomeId_fkey";

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_familyMemberIncomeId_fkey";

-- DropForeignKey
ALTER TABLE "medications" DROP CONSTRAINT "medications_familyMemberDisease_id_fkey";

-- AlterTable
ALTER TABLE "FamilyMemberIncome" DROP COLUMN "familyMemberId",
ADD COLUMN     "familyMember_id" TEXT NOT NULL,
DROP COLUMN "occupation",
ADD COLUMN     "occupation" "EmploymentType" NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyIncome" DROP COLUMN "advancePayment",
DROP COLUMN "compensation",
DROP COLUMN "expenseReimbursement",
DROP COLUMN "familyMemberIncomeId",
DROP COLUMN "foodAllowance",
DROP COLUMN "judicialPension",
DROP COLUMN "reversals",
DROP COLUMN "transportAllowance",
ADD COLUMN     "familyMemberIncome_id" TEXT NOT NULL,
ADD COLUMN     "liquidAmount" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Salary" DROP COLUMN "familyMemberIncomeId",
ADD COLUMN     "familyMemberIncome_id" TEXT NOT NULL,
ALTER COLUMN "value" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "medications" DROP COLUMN "familyMemberDisease_id",
ADD COLUMN     "familyMember_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FamilyMemberIncome" ADD CONSTRAINT "FamilyMemberIncome_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_familyMemberIncome_id_fkey" FOREIGN KEY ("familyMemberIncome_id") REFERENCES "FamilyMemberIncome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyIncome" ADD CONSTRAINT "MonthlyIncome_familyMemberIncome_id_fkey" FOREIGN KEY ("familyMemberIncome_id") REFERENCES "FamilyMemberIncome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
