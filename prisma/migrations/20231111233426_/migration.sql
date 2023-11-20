/*
  Warnings:

  - You are about to drop the column `installmentCount` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `installmentValue` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `optedForInstallment` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `otherExpenses` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "installmentCount",
DROP COLUMN "installmentValue",
DROP COLUMN "optedForInstallment",
DROP COLUMN "otherExpenses",
ADD COLUMN     "installmentCountIPTU" INTEGER,
ADD COLUMN     "installmentCountIPVA" INTEGER,
ADD COLUMN     "installmentCountIR" INTEGER,
ADD COLUMN     "installmentCountITR" INTEGER,
ADD COLUMN     "installmentValueIPTU" DOUBLE PRECISION,
ADD COLUMN     "installmentValueIPVA" DOUBLE PRECISION,
ADD COLUMN     "installmentValueIR" DOUBLE PRECISION,
ADD COLUMN     "installmentValueITR" DOUBLE PRECISION,
ADD COLUMN     "optedForInstallmentIPTU" BOOLEAN,
ADD COLUMN     "optedForInstallmentIPVA" BOOLEAN,
ADD COLUMN     "optedForInstallmentIR" BOOLEAN,
ADD COLUMN     "optedForInstallmentITR" BOOLEAN,
ADD COLUMN     "otherExpensesDescription" TEXT[],
ADD COLUMN     "otherExpensesValue" DOUBLE PRECISION[];
