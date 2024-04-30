/*
  Warnings:

  - A unique constraint covering the columns `[id,responsible_id]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "averageIncome" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "candidates_id_responsible_id_key" ON "candidates"("id", "responsible_id");
