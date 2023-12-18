-- DropForeignKey
ALTER TABLE "EducationLevel" DROP CONSTRAINT "EducationLevel_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "Timeline" DROP CONSTRAINT "Timeline_announcementId_fkey";

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "types1" "scholarshipGrantedType"[];

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationLevel" ADD CONSTRAINT "EducationLevel_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
