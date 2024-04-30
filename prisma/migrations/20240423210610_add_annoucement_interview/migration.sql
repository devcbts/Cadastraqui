-- CreateEnum
CREATE TYPE "TiebreakerCriterias" AS ENUM ('CadUnico', 'LeastFamilyIncome', 'SeriousIllness', 'Draw');

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "closeDate" TIMESTAMP(3),
ADD COLUMN     "criteria" "TiebreakerCriterias"[] DEFAULT ARRAY['CadUnico', 'LeastFamilyIncome', 'SeriousIllness', 'Draw']::"TiebreakerCriterias"[],
ADD COLUMN     "openDate" TIMESTAMP(3),
ADD COLUMN     "waitingList" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AnnouncementInterview" (
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "beginHour" TIME(0) NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 5,
    "endHour" TIME(0) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 20,
    "announcement_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AnnouncementInterview_announcement_id_key" ON "AnnouncementInterview"("announcement_id");

-- AddForeignKey
ALTER TABLE "AnnouncementInterview" ADD CONSTRAINT "AnnouncementInterview_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
