/*
  Warnings:

  - A unique constraint covering the columns `[RG]` on the table `assistants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CRESS]` on the table `assistants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CRESS` to the `assistants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RG` to the `assistants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_id` to the `assistants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `assistants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "assistants" ADD COLUMN     "CRESS" TEXT NOT NULL,
ADD COLUMN     "RG" TEXT NOT NULL,
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "assistants_RG_key" ON "assistants"("RG");

-- CreateIndex
CREATE UNIQUE INDEX "assistants_CRESS_key" ON "assistants"("CRESS");

-- AddForeignKey
ALTER TABLE "assistants" ADD CONSTRAINT "assistants_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
