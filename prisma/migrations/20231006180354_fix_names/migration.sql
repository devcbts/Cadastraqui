/*
  Warnings:

  - You are about to drop the column `created_at` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_address` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `responsibles` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `responsibles` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_address` on the `responsibles` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Assistant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FamilyMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Housing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegisterDetails` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `addressNumber` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressNumber` to the `responsibles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `responsibles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assistant" DROP CONSTRAINT "Assistant_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "Assistant" DROP CONSTRAINT "Assistant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Entity" DROP CONSTRAINT "Entity_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FamilyMembers" DROP CONSTRAINT "FamilyMembers_candidate_id_fkey";

-- DropForeignKey
ALTER TABLE "RegisterDetails" DROP CONSTRAINT "RegisterDetails_candidate_id_fkey";

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "created_at",
DROP COLUMN "date_of_birth",
DROP COLUMN "number_of_address",
ADD COLUMN     "addressNumber" INTEGER NOT NULL,
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "responsibles" DROP COLUMN "created_at",
DROP COLUMN "date_of_birth",
DROP COLUMN "number_of_address",
ADD COLUMN     "addressNumber" INTEGER NOT NULL,
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Assistant";

-- DropTable
DROP TABLE "Entity";

-- DropTable
DROP TABLE "FamilyMembers";

-- DropTable
DROP TABLE "Housing";

-- DropTable
DROP TABLE "RegisterDetails";

-- CreateTable
CREATE TABLE "assistants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,

    CONSTRAINT "assistants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registerDetails" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "UF" "COUNTRY",
    "city" TEXT,
    "CPF" TEXT NOT NULL,
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
    "postalCode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "addressCity" TEXT NOT NULL,
    "addressState" TEXT NOT NULL,
    "landmark" TEXT,
    "profession" TEXT NOT NULL,
    "enrolledGovernmentProgram" BOOLEAN,
    "nis" TEXT,
    "incomeSource" TEXT[],
    "livesAlone" BOOLEAN NOT NULL,
    "intendsToGetScholarship" BOOLEAN NOT NULL,
    "attendedPublicHighSchool" BOOLEAN,
    "benefitedFromCebasScholarship" BOOLEAN,
    "educationType" "EDUCATION_TYPE",
    "gradeOrSemester" TEXT,
    "shift" TEXT,
    "hasScholarship" BOOLEAN,
    "scholarshipPercentage" INTEGER,
    "livesAtSameAddress" BOOLEAN NOT NULL,
    "numberOfMinorCandidates" INTEGER,
    "educationInstitution" TEXT,
    "institutionType" "INSTITUTION_TYPE",
    "responsibleEducationLevel" "EDUCATION_TYPE",
    "responsibleGradeOrSemester" TEXT,
    "responsibleShift" "SHIFT",
    "candidate_id" TEXT NOT NULL,

    CONSTRAINT "registerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familyMembers" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "relationship" "Relationship" NOT NULL,
    "otherRelationship" TEXT,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "age" INTEGER,
    "gender" "GENDER" NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "cpf" TEXT,
    "rg" TEXT,
    "rgIssuingAuthority" TEXT,
    "rgIssuingState" TEXT,
    "documentType" "DOCUMENT_TYPE",
    "documentNumber" TEXT,
    "documentValidity" TIMESTAMP(3),
    "birthRegistrationNumber" TEXT,
    "birthRegistrationBook" TEXT,
    "birthRegistrationPage" TEXT,
    "maritalStatus" "MARITAL_STATUS" NOT NULL,
    "skinColor" "SkinColor" NOT NULL,
    "religion" "RELIGION" NOT NULL,
    "educationLevel" "EDUCATION_TYPE" NOT NULL,
    "specialNeeds" BOOLEAN,
    "specialNeedsDescription" TEXT,
    "hasMedicalReport" BOOLEAN,
    "landlinePhone" TEXT,
    "workPhone" TEXT,
    "contactNameForMessage" TEXT,
    "profession" TEXT NOT NULL,
    "enrolledGovernmentProgram" BOOLEAN,
    "nis" TEXT,
    "incomeSource" "IncomeSource"[],

    CONSTRAINT "familyMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "housing" (
    "id" TEXT NOT NULL,
    "propertyStatus" "PropertyStatus" NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "grantorName" TEXT NOT NULL,
    "timeLivingInProperty" "TimeLivingInProperty" NOT NULL,
    "domicileType" "DomicileType" NOT NULL,
    "numberOfRooms" "NumberOfRooms" NOT NULL,
    "numberOfBedrooms" INTEGER NOT NULL,

    CONSTRAINT "housing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registerDetails_email_key" ON "registerDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "registerDetails_CPF_key" ON "registerDetails"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "registerDetails_RG_key" ON "registerDetails"("RG");

-- CreateIndex
CREATE UNIQUE INDEX "familyMembers_cpf_key" ON "familyMembers"("cpf");

-- AddForeignKey
ALTER TABLE "assistants" ADD CONSTRAINT "assistants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistants" ADD CONSTRAINT "assistants_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registerDetails" ADD CONSTRAINT "registerDetails_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familyMembers" ADD CONSTRAINT "familyMembers_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
