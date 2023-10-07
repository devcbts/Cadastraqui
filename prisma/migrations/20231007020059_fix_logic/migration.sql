/*
  Warnings:

  - A unique constraint covering the columns `[entity_id]` on the table `EntityMatrix` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EntityMatrix_entity_id_key" ON "EntityMatrix"("entity_id");
