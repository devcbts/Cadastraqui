/*
  Warnings:

  - You are about to drop the column `month` on the `MonthlyIncome` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `MonthlyIncome` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MonthlyIncome" DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
