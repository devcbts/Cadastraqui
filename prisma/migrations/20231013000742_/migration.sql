/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `EntityDirector` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `EntityDirector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `EntityDirector` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntityDirector" ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EntityDirector_user_id_key" ON "EntityDirector"("user_id");

-- AddForeignKey
ALTER TABLE "EntityDirector" ADD CONSTRAINT "EntityDirector_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
