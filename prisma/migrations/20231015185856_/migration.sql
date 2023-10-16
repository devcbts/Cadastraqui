/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `EntitySubsidiary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EntitySubsidiary_user_id_key" ON "EntitySubsidiary"("user_id");
