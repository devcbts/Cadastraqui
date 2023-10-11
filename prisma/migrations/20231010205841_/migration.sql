/*
  Warnings:

  - You are about to drop the column `candidateId` on the `housing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[candidate_id]` on the table `housing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candidate_id` to the `housing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "housing" DROP CONSTRAINT "housing_candidateId_fkey";

-- DropIndex
DROP INDEX "housing_candidateId_key";

-- AlterTable
ALTER TABLE "housing" DROP COLUMN "candidateId",
ADD COLUMN     "candidate_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "housing_candidate_id_key" ON "housing"("candidate_id");

-- AddForeignKey
ALTER TABLE "housing" ADD CONSTRAINT "housing_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
