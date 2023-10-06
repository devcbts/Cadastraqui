-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "DOCUMENT_TYPE" AS ENUM ('DriversLicense', 'FunctionalCard', 'MilitaryID', 'ForeignerRegistration', 'Passport', 'WorkCard');

-- CreateEnum
CREATE TYPE "MARITAL_STATUS" AS ENUM ('Single', 'Married', 'Separated', 'Divorced', 'Widowed', 'StableUnion');

-- CreateEnum
CREATE TYPE "SkinColor" AS ENUM ('Yellow', 'White', 'Indigenous', 'Brown', 'Black', 'NotDeclared');

-- CreateEnum
CREATE TYPE "RELIGION" AS ENUM ('Catholic', 'Evangelical', 'Spiritist', 'Atheist', 'Other', 'NotDeclared');

-- CreateEnum
CREATE TYPE "SCHOLARSHIP" AS ENUM ('Illiterate', 'ElementarySchool', 'HighSchool', 'CollegeGraduate', 'CollegeUndergraduate', 'Postgraduate', 'Masters', 'Doctorate', 'PostDoctorate');

-- CreateEnum
CREATE TYPE "EDUCATION_TYPE" AS ENUM ('Alfabetizacao', 'Ensino_Medio', 'Ensino_Tecnico', 'Ensino_Superior');

-- CreateEnum
CREATE TYPE "SHIFT" AS ENUM ('Matutino', 'Vespertino', 'Noturno', 'Integral');

-- CreateEnum
CREATE TYPE "INSTITUTION_TYPE" AS ENUM ('Publica', 'Privada');

-- CreateEnum
CREATE TYPE "IncomeSource" AS ENUM ('PrivateEmployee', 'PublicEmployee', 'DomesticEmployee', 'TemporaryRuralEmployee', 'BusinessOwnerSimplifiedTax', 'BusinessOwner', 'IndividualEntrepreneur', 'SelfEmployed', 'Retired', 'Pensioner', 'Apprentice', 'Volunteer', 'RentalIncome', 'Student', 'InformalWorker', 'Unemployed', 'TemporaryDisabilityBenefit', 'LiberalProfessional', 'FinancialHelpFromOthers', 'Alimony', 'PrivatePension');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('Wife', 'Husband', 'Father', 'Mother', 'Stepfather', 'Stepmother', 'Sibling', 'Grandparent', 'Child', 'Other');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('OwnPaidOff', 'OwnFinanced', 'Rented', 'ProvidedByEmployer', 'ProvidedByFamily', 'ProvidedOtherWay', 'Irregular');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('Verbal', 'ThroughRealEstateAgency', 'DirectWithOwner');

-- CreateEnum
CREATE TYPE "TimeLivingInProperty" AS ENUM ('UpTo11Months', 'From1To10Years', 'From10To20Years', 'Over20Years');

-- CreateEnum
CREATE TYPE "DomicileType" AS ENUM ('House', 'CondominiumHouse', 'Apartment', 'RoomingHouse');

-- CreateEnum
CREATE TYPE "NumberOfRooms" AS ENUM ('One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve');

-- CreateTable
CREATE TABLE "RegisterDetails" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "state" "COUNTRY",
    "city" TEXT,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
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

    CONSTRAINT "RegisterDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMembers" (
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

    CONSTRAINT "FamilyMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Housing" (
    "id" TEXT NOT NULL,
    "propertyStatus" "PropertyStatus" NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "grantorName" TEXT NOT NULL,
    "timeLivingInProperty" "TimeLivingInProperty" NOT NULL,
    "domicileType" "DomicileType" NOT NULL,
    "numberOfRooms" "NumberOfRooms" NOT NULL,
    "numberOfBedrooms" INTEGER NOT NULL,

    CONSTRAINT "Housing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisterDetails_email_key" ON "RegisterDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterDetails_cpf_key" ON "RegisterDetails"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterDetails_rg_key" ON "RegisterDetails"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMembers_cpf_key" ON "FamilyMembers"("cpf");

-- AddForeignKey
ALTER TABLE "RegisterDetails" ADD CONSTRAINT "RegisterDetails_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMembers" ADD CONSTRAINT "FamilyMembers_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
