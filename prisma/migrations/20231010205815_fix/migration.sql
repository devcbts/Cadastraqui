/*
  Warnings:

  - A unique constraint covering the columns `[candidateId]` on the table `housing` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "housing" ADD COLUMN     "responsible_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "housing_candidateId_key" ON "housing"("candidateId");

-- AddForeignKey
ALTER TABLE "housing" ADD CONSTRAINT "housing_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
