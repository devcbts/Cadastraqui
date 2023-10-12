/*
  Warnings:

  - A unique constraint covering the columns `[CNPJ]` on the table `EntitySubsidiary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CNPJ]` on the table `entities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EntitySubsidiary_CNPJ_key" ON "EntitySubsidiary"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "entities_CNPJ_key" ON "entities"("CNPJ");
