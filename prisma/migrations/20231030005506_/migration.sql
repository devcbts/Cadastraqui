-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "announcementName" TEXT,
ALTER COLUMN "announcementNumber" DROP NOT NULL,
ALTER COLUMN "announcementDate" DROP NOT NULL;
