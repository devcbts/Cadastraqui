/*
  Warnings:

  - A unique constraint covering the columns `[entity_matrix_id]` on the table `EntitySubsidiary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EntitySubsidiary_entity_matrix_id_key" ON "EntitySubsidiary"("entity_matrix_id");
