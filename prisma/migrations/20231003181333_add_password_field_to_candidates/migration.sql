/*
  Warnings:

  - Added the required column `password` to the `candidates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "password" TEXT NOT NULL;
