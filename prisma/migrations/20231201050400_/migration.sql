-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_announcement_id_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_candidate_id_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationHistory" DROP CONSTRAINT "ApplicationHistory_application_id_fkey";

-- DropForeignKey
ALTER TABLE "medications" DROP CONSTRAINT "medications_familyMember_id_fkey";

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationHistory" ADD CONSTRAINT "ApplicationHistory_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
