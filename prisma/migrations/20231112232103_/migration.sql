/*
  Warnings:

  - Added the required column `candidate_id` to the `CreditCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidate_id` to the `Financing` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `financingType` on the `Financing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `candidate_id` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidate_id` to the `OtherExpense` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FinancingType" AS ENUM ('Car', 'Motorcycle', 'Truck', 'House_Apartment_Land', 'Other');

-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "candidate_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Financing" ADD COLUMN     "candidate_id" TEXT NOT NULL,
ADD COLUMN     "otherFinancing" TEXT,
DROP COLUMN "financingType",
ADD COLUMN     "financingType" "FinancingType" NOT NULL;

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "candidate_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OtherExpense" ADD COLUMN     "candidate_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financing" ADD CONSTRAINT "Financing_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherExpense" ADD CONSTRAINT "OtherExpense_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
