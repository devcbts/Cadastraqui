/*
  Warnings:

  - A unique constraint covering the columns `[CPF]` on the table `EntityDirector` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entity_id` to the `Announcement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "entity_id" TEXT NOT NULL,
ALTER COLUMN "announcementNumber" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "EntityDirector_CPF_key" ON "EntityDirector"("CPF");

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
