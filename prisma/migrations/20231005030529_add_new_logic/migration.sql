/*
  Warnings:

  - You are about to drop the `dependents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dependents" DROP CONSTRAINT "dependents_responsible_id_fkey";

-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "responsible_id" TEXT;

-- DropTable
DROP TABLE "dependents";

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
