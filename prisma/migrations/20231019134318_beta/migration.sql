/*
  Warnings:

  - You are about to drop the `SelectionProcessResponsible` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `assistants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Approved', 'Rejected', 'Pending');

-- DropForeignKey
ALTER TABLE "SelectionProcessResponsible" DROP CONSTRAINT "SelectionProcessResponsible_entity_subsidiary_id_fkey";

-- DropForeignKey
ALTER TABLE "SelectionProcessResponsible" DROP CONSTRAINT "SelectionProcessResponsible_user_id_fkey";

-- DropTable
DROP TABLE "SelectionProcessResponsible";

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "announcement_id" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "socialAssistant_id" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationHistory" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnnouncementToSocialAssistant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AnnouncementToSocialAssistant_AB_unique" ON "_AnnouncementToSocialAssistant"("A", "B");

-- CreateIndex
CREATE INDEX "_AnnouncementToSocialAssistant_B_index" ON "_AnnouncementToSocialAssistant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "assistants_user_id_key" ON "assistants"("user_id");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_socialAssistant_id_fkey" FOREIGN KEY ("socialAssistant_id") REFERENCES "assistants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationHistory" ADD CONSTRAINT "ApplicationHistory_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToSocialAssistant" ADD CONSTRAINT "_AnnouncementToSocialAssistant_A_fkey" FOREIGN KEY ("A") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToSocialAssistant" ADD CONSTRAINT "_AnnouncementToSocialAssistant_B_fkey" FOREIGN KEY ("B") REFERENCES "assistants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
