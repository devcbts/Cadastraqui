/*
  Warnings:

  - You are about to drop the column `email` on the `EntityDirector` table. All the data in the column will be lost.
  - You are about to drop the column `entity_matrix_id` on the `EntityDirector` table. All the data in the column will be lost.
  - You are about to drop the column `UF` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `addressComplement` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `addressNumber` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `addressStreet` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `entity_matrix_id` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `SelectionProcessResponsible` table. All the data in the column will be lost.
  - You are about to drop the column `entity_matrix_id` on the `SelectionProcessResponsible` table. All the data in the column will be lost.
  - You are about to drop the column `entity_matrix_id` on the `assistants` table. All the data in the column will be lost.
  - You are about to drop the `EntityMatrix` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `announcementNumber` on the `Announcement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `address` to the `EntitySubsidiary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_id` to the `EntitySubsidiary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialReason` to the `EntitySubsidiary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CEP` to the `entities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `entities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EntityDirector" DROP CONSTRAINT "EntityDirector_entity_matrix_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityMatrix" DROP CONSTRAINT "EntityMatrix_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "EntitySubsidiary" DROP CONSTRAINT "EntitySubsidiary_entity_matrix_id_fkey";

-- DropForeignKey
ALTER TABLE "SelectionProcessResponsible" DROP CONSTRAINT "SelectionProcessResponsible_entity_matrix_id_fkey";

-- DropForeignKey
ALTER TABLE "assistants" DROP CONSTRAINT "assistants_entity_matrix_id_fkey";

-- DropIndex
DROP INDEX "EntitySubsidiary_entity_matrix_id_key";

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "entity_subsidiary_id" TEXT,
DROP COLUMN "announcementNumber",
ADD COLUMN     "announcementNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EntityDirector" DROP COLUMN "email",
DROP COLUMN "entity_matrix_id";

-- AlterTable
ALTER TABLE "EntitySubsidiary" DROP COLUMN "UF",
DROP COLUMN "addressComplement",
DROP COLUMN "addressNumber",
DROP COLUMN "addressStreet",
DROP COLUMN "city",
DROP COLUMN "code",
DROP COLUMN "entity_matrix_id",
DROP COLUMN "neighborhood",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "socialReason" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SelectionProcessResponsible" DROP COLUMN "email",
DROP COLUMN "entity_matrix_id";

-- AlterTable
ALTER TABLE "assistants" DROP COLUMN "entity_matrix_id";

-- AlterTable
ALTER TABLE "entities" ADD COLUMN     "CEP" TEXT NOT NULL,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "educationalInstitutionCode" TEXT,
ALTER COLUMN "logo" DROP NOT NULL;

-- DropTable
DROP TABLE "EntityMatrix";

-- AddForeignKey
ALTER TABLE "EntitySubsidiary" ADD CONSTRAINT "EntitySubsidiary_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_entity_subsidiary_id_fkey" FOREIGN KEY ("entity_subsidiary_id") REFERENCES "EntitySubsidiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
