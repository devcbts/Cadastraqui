/*
  Warnings:

  - Made the column `phone` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `UF` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CEP` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `neighborhood` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number_of_address` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `candidates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "candidates" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "UF" SET NOT NULL,
ALTER COLUMN "CEP" SET NOT NULL,
ALTER COLUMN "neighborhood" SET NOT NULL,
ALTER COLUMN "number_of_address" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL;
