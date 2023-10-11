/*
  Warnings:

  - You are about to drop the `registerDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ScholarshipType" AS ENUM ('integralScholarchip', 'halfScholarchip');

-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('ScholarshipGrant', 'PeriodicVerification');

-- CreateEnum
CREATE TYPE "LevelType" AS ENUM ('BasicEducation', 'HigherEducation');

-- CreateEnum
CREATE TYPE "BasicEducationType" AS ENUM ('Preschool', 'Elementary', 'HighSchool', 'ProfessionalEducation');

-- CreateEnum
CREATE TYPE "ScholarshipOfferType" AS ENUM ('Law187Scholarship', 'StudentWithDisability', 'FullTime', 'EntityWorkers');

-- CreateEnum
CREATE TYPE "HigherEducationScholarshipType" AS ENUM ('PROUNIFull', 'PROUNIPartial', 'StateGovernment', 'CityGovernment', 'ExternalEntities', 'HigherEduInstitutionFull', 'HigherEduInstitutionPartial', 'HigherEduInstitutionWorkers', 'PostgraduateStrictoSensu');

-- CreateEnum
CREATE TYPE "OfferedCourseType" AS ENUM ('UndergraduateBachelor', 'UndergraduateLicense', 'UndergraduateTechnologist');

-- DropForeignKey
ALTER TABLE "registerDetails" DROP CONSTRAINT "registerDetails_candidate_id_fkey";

-- AlterTable
ALTER TABLE "responsibles" ADD COLUMN     "ResponsibleEducationInstitution" TEXT,
ADD COLUMN     "institutionType" "INSTITUTION_TYPE",
ADD COLUMN     "livesAtSameAddress" BOOLEAN,
ADD COLUMN     "responsibleEducationLevel" "EDUCATION_TYPE",
ADD COLUMN     "responsibleGradeOrSemester" TEXT,
ADD COLUMN     "responsibleShift" "SHIFT";

-- DropTable
DROP TABLE "registerDetails";

-- CreateTable
CREATE TABLE "IdentityDetails" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "socialName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" "GENDER" NOT NULL,
    "nationality" TEXT NOT NULL,
    "natural_city" TEXT NOT NULL,
    "natural_UF" "COUNTRY" NOT NULL,
    "RG" TEXT NOT NULL,
    "rgIssuingAuthority" TEXT NOT NULL,
    "rgIssuingState" TEXT NOT NULL,
    "documentType" "DOCUMENT_TYPE",
    "documentNumber" TEXT,
    "documentValidity" TIMESTAMP(3),
    "maritalStatus" "MARITAL_STATUS" NOT NULL,
    "skinColor" "SkinColor" NOT NULL,
    "religion" "RELIGION" NOT NULL,
    "educationLevel" "SCHOLARSHIP" NOT NULL,
    "specialNeeds" BOOLEAN,
    "specialNeedsDescription" TEXT,
    "hasMedicalReport" BOOLEAN,
    "landlinePhone" TEXT,
    "workPhone" TEXT,
    "contactNameForMessage" TEXT,
    "profession" TEXT NOT NULL,
    "enrolledGovernmentProgram" BOOLEAN,
    "NIS" TEXT,
    "incomeSource" "IncomeSource"[],
    "livesAlone" BOOLEAN NOT NULL,
    "intendsToGetScholarship" BOOLEAN NOT NULL,
    "attendedPublicHighSchool" BOOLEAN,
    "benefitedFromCebasScholarship_basic" BOOLEAN,
    "yearsBenefitedFromCebas_basic" TEXT[],
    "scholarshipType_basic" "ScholarshipType",
    "institutionName_basic" TEXT,
    "institutionCNPJ_basic" TEXT,
    "benefitedFromCebasScholarship_professional" BOOLEAN,
    "lastYearBenefitedFromCebas_professional" TEXT,
    "scholarshipType_professional" "ScholarshipType",
    "institutionName_professional" TEXT,
    "institutionCNPJ_professional" TEXT,
    "nameOfScholarshipCourse_professional" TEXT,
    "candidate_id" TEXT NOT NULL,
    "responsible_id" TEXT,

    CONSTRAINT "IdentityDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "entityChanged" BOOLEAN,
    "branchChanged" BOOLEAN,
    "announcementType" "AnnouncementType" NOT NULL,
    "announcementNumber" TEXT NOT NULL,
    "announcementDate" TIMESTAMP(3) NOT NULL,
    "offeredVacancies" INTEGER,
    "verifiedScholarships" INTEGER,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timeline" (
    "id" TEXT NOT NULL,
    "controlLine" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "announcementId" TEXT NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationLevel" (
    "id" TEXT NOT NULL,
    "level" "LevelType" NOT NULL,
    "basicEduType" "BasicEducationType",
    "scholarshipType" "ScholarshipOfferType",
    "higherEduScholarshipType" "HigherEducationScholarshipType",
    "offeredCourseType" "OfferedCourseType",
    "availableCourses" TEXT,
    "announcementId" TEXT NOT NULL,

    CONSTRAINT "EducationLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdentityDetails_RG_key" ON "IdentityDetails"("RG");

-- AddForeignKey
ALTER TABLE "IdentityDetails" ADD CONSTRAINT "IdentityDetails_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityDetails" ADD CONSTRAINT "IdentityDetails_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationLevel" ADD CONSTRAINT "EducationLevel_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
