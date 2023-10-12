/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `entities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "entities_user_id_key" ON "entities"("user_id");
