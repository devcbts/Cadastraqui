/*
  Warnings:

  - Made the column `created_at` on table `candidates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `dependents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `responsibles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "candidates" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "dependents" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "responsibles" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;
