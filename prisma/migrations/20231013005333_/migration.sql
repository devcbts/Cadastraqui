/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `SelectionProcessResponsible` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `SelectionProcessResponsible` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ROLE" ADD VALUE 'SELECTION_RESPONSIBLE';

-- AlterTable
ALTER TABLE "SelectionProcessResponsible" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SelectionProcessResponsible_user_id_key" ON "SelectionProcessResponsible"("user_id");

-- AddForeignKey
ALTER TABLE "SelectionProcessResponsible" ADD CONSTRAINT "SelectionProcessResponsible_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
