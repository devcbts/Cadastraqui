/*
  Warnings:

  - A unique constraint covering the columns `[candidate_id,announcement_id]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "scholarshipGrantedType" AS ENUM ('UNIFORM', 'TRANSPORT', 'FOOD', 'HOUSING', 'STUDY_MATERIAL');

-- AlterTable
ALTER TABLE "ApplicationHistory" ADD COLUMN     "answered" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "ScholarshipGranted" (
    "id" TEXT NOT NULL,
    "gaveUp" BOOLEAN NOT NULL,
    "ScholarshipCode" TEXT NOT NULL,
    "types" "scholarshipGrantedType"[],
    "application_id" TEXT NOT NULL,
    "announcement_id" TEXT NOT NULL,

    CONSTRAINT "ScholarshipGranted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipGranted_application_id_key" ON "ScholarshipGranted"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "Application_candidate_id_announcement_id_key" ON "Application"("candidate_id", "announcement_id");

-- AddForeignKey
ALTER TABLE "ScholarshipGranted" ADD CONSTRAINT "ScholarshipGranted_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipGranted" ADD CONSTRAINT "ScholarshipGranted_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
