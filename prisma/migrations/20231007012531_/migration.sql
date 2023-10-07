/*
  Warnings:

  - You are about to drop the column `entity_id` on the `assistants` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `entities` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `entities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[CPF]` on the table `assistants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CPF` to the `assistants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CNPJ` to the `entities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `entities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialReason` to the `entities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "assistants" DROP CONSTRAINT "assistants_entity_id_fkey";

-- AlterTable
ALTER TABLE "assistants" DROP COLUMN "entity_id",
ADD COLUMN     "CPF" TEXT NOT NULL,
ADD COLUMN     "entity_matrix_id" TEXT,
ADD COLUMN     "entity_subsidiary_id" TEXT;

-- AlterTable
ALTER TABLE "entities" DROP COLUMN "address",
DROP COLUMN "phone",
ADD COLUMN     "CNPJ" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "socialReason" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "EntityMatrix" (
    "id" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "publicPlace" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "addressNumber" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "UF" "COUNTRY" NOT NULL,
    "addressComplement" TEXT,
    "educationalArea" BOOLEAN NOT NULL,
    "educationalInstitutionCode" TEXT,
    "entity_id" TEXT NOT NULL,

    CONSTRAINT "EntityMatrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntitySubsidiary" (
    "id" TEXT NOT NULL,
    "CNPJ" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "country" "COUNTRY" NOT NULL,
    "entity_matrix_id" TEXT NOT NULL,

    CONSTRAINT "EntitySubsidiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityDirector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "entity_matrix_id" TEXT,
    "entity_subsidiary_id" TEXT,

    CONSTRAINT "EntityDirector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectionProcessResponsible" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "entity_matrix_id" TEXT,
    "entity_subsidiary_id" TEXT,

    CONSTRAINT "SelectionProcessResponsible_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntityDirector_CPF_key" ON "EntityDirector"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "SelectionProcessResponsible_CPF_key" ON "SelectionProcessResponsible"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "assistants_CPF_key" ON "assistants"("CPF");

-- AddForeignKey
ALTER TABLE "assistants" ADD CONSTRAINT "assistants_entity_matrix_id_fkey" FOREIGN KEY ("entity_matrix_id") REFERENCES "EntityMatrix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistants" ADD CONSTRAINT "assistants_entity_subsidiary_id_fkey" FOREIGN KEY ("entity_subsidiary_id") REFERENCES "EntitySubsidiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMatrix" ADD CONSTRAINT "EntityMatrix_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntitySubsidiary" ADD CONSTRAINT "EntitySubsidiary_entity_matrix_id_fkey" FOREIGN KEY ("entity_matrix_id") REFERENCES "EntityMatrix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityDirector" ADD CONSTRAINT "EntityDirector_entity_matrix_id_fkey" FOREIGN KEY ("entity_matrix_id") REFERENCES "EntityMatrix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityDirector" ADD CONSTRAINT "EntityDirector_entity_subsidiary_id_fkey" FOREIGN KEY ("entity_subsidiary_id") REFERENCES "EntitySubsidiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionProcessResponsible" ADD CONSTRAINT "SelectionProcessResponsible_entity_matrix_id_fkey" FOREIGN KEY ("entity_matrix_id") REFERENCES "EntityMatrix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionProcessResponsible" ADD CONSTRAINT "SelectionProcessResponsible_entity_subsidiary_id_fkey" FOREIGN KEY ("entity_subsidiary_id") REFERENCES "EntitySubsidiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
