-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'CANDIDATE', 'RESPONSIBLE', 'ENTITY', 'ASSISTANT', 'ENTITY_SUB', 'ENTITY_DIRECTOR', 'SELECTION_RESPONSIBLE');

-- CreateEnum
CREATE TYPE "COUNTRY" AS ENUM ('AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO');

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
CREATE TYPE "INSTITUTION_TYPE" AS ENUM ('Public', 'Private');

-- CreateEnum
CREATE TYPE "IncomeSource" AS ENUM ('PrivateEmployee', 'PublicEmployee', 'DomesticEmployee', 'TemporaryRuralEmployee', 'BusinessOwnerSimplifiedTax', 'BusinessOwner', 'IndividualEntrepreneur', 'SelfEmployed', 'Retired', 'Pensioner', 'Apprentice', 'Volunteer', 'RentalIncome', 'Student', 'InformalWorker', 'Unemployed', 'TemporaryDisabilityBenefit', 'LiberalProfessional', 'FinancialHelpFromOthers', 'Alimony', 'PrivatePension');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('Wife', 'Husband', 'Father', 'Mother', 'Stepfather', 'Stepmother', 'Sibling', 'Grandparent', 'Child', 'Other');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('SmallCarsAndUtilities', 'TrucksAndMinibuses', 'Motorcycles');

-- CreateEnum
CREATE TYPE "VehicleSituation" AS ENUM ('PaidOff', 'Financed');

-- CreateEnum
CREATE TYPE "VehicleUsage" AS ENUM ('WorkInstrument', 'NecessaryDisplacement');

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

-- CreateEnum
CREATE TYPE "Disease" AS ENUM ('ALIENATION_MENTAL', 'CARDIOPATHY_SEVERE', 'BLINDNESS', 'RADIATION_CONTAMINATION', 'PARKINSONS_DISEASE', 'ANKYLOSING_SPONDYLITIS', 'PAGETS_DISEASE', 'HANSENS_DISEASE', 'SEVERE_HEPATOPATHY', 'SEVERE_NEPHROPATHY', 'PARALYSIS', 'ACTIVE_TUBERCULOSIS', 'HIV_AIDS', 'MALIGNANT_NEOPLASM', 'TERMINAL_STAGE', 'MICROCEPHALY', 'AUTISM_SPECTRUM_DISORDER', 'RARE_DISEASE', 'OTHER_HIGH_COST_DISEASE');

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

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "UF" "COUNTRY" NOT NULL,
    "CEP" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "addressNumber" INTEGER NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'CANDIDATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "responsible_id" TEXT,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'CANDIDATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsibles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "UF" "COUNTRY" NOT NULL,
    "CEP" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "addressNumber" INTEGER NOT NULL,
    "livesAtSameAddress" BOOLEAN,
    "institutionType" "INSTITUTION_TYPE",
    "responsibleEducationLevel" "EDUCATION_TYPE",
    "responsibleGradeOrSemester" TEXT,
    "responsibleShift" "SHIFT",
    "ResponsibleEducationInstitution" TEXT,
    "role" "ROLE" NOT NULL DEFAULT 'RESPONSIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "responsibles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assistants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entity_subsidiary_id" TEXT,

    CONSTRAINT "assistants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "socialReason" TEXT NOT NULL,
    "logo" TEXT,
    "CNPJ" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "educationalInstitutionCode" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntitySubsidiary" (
    "id" TEXT NOT NULL,
    "CNPJ" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "socialReason" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "educationalInstitutionCode" TEXT,
    "entity_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "EntitySubsidiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityDirector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entity_subsidiary_id" TEXT,
    "entity_id" TEXT,

    CONSTRAINT "EntityDirector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectionProcessResponsible" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entity_subsidiary_id" TEXT,

    CONSTRAINT "SelectionProcessResponsible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityDetails" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "socialName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
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
CREATE TABLE "familyMembers" (
    "id" TEXT NOT NULL,
    "relationship" "Relationship" NOT NULL,
    "otherRelationship" TEXT,
    "fullName" TEXT NOT NULL,
    "socialName" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "GENDER" NOT NULL,
    "nationality" TEXT NOT NULL,
    "natural_city" TEXT NOT NULL,
    "natural_UF" "COUNTRY" NOT NULL,
    "CPF" TEXT NOT NULL,
    "RG" TEXT NOT NULL,
    "rgIssuingAuthority" TEXT NOT NULL,
    "rgIssuingState" TEXT NOT NULL,
    "documentType" "DOCUMENT_TYPE",
    "documentNumber" TEXT,
    "documentValidity" TIMESTAMP(3),
    "numberOfBirthRegister" TEXT,
    "bookOfBirthRegister" TEXT,
    "pageOfBirthRegister" TEXT,
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
    "email" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "UF" "COUNTRY" NOT NULL,
    "CEP" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "addressNumber" INTEGER NOT NULL,
    "profession" TEXT NOT NULL,
    "enrolledGovernmentProgram" BOOLEAN,
    "NIS" TEXT,
    "educationPlace" "INSTITUTION_TYPE",
    "institutionName" TEXT,
    "coursingEducationLevel" "EDUCATION_TYPE",
    "cycleOfEducation" TEXT,
    "turnOfEducation" "SHIFT",
    "hasScholarship" BOOLEAN,
    "percentageOfScholarship" TEXT,
    "monthlyAmount" TEXT,
    "candidate_id" TEXT NOT NULL,

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
    "candidate_id" TEXT NOT NULL,
    "responsible_id" TEXT,

    CONSTRAINT "housing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "modelAndBrand" TEXT NOT NULL,
    "manufacturingYear" INTEGER NOT NULL,
    "situation" "VehicleSituation" NOT NULL,
    "financedMonths" INTEGER,
    "monthsToPayOff" INTEGER,
    "hasInsurance" BOOLEAN NOT NULL DEFAULT false,
    "insuranceValue" DOUBLE PRECISION,
    "usage" "VehicleUsage" NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMemberIncome" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "hiringDate" TIMESTAMP(3) NOT NULL,
    "position" TEXT NOT NULL,
    "payerDetails" TEXT NOT NULL,
    "employerOrGovernment" TEXT NOT NULL,
    "employerPhone" TEXT NOT NULL,
    "receivesOvertime" BOOLEAN NOT NULL,
    "familyMemberId" TEXT NOT NULL,

    CONSTRAINT "FamilyMemberIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "familyMemberIncomeId" TEXT NOT NULL,
    "value" DECIMAL(65,30),
    "index" INTEGER NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyIncome" (
    "id" TEXT NOT NULL,
    "familyMemberIncomeId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "grossAmount" DECIMAL(65,30) NOT NULL,
    "hadDeduction" BOOLEAN NOT NULL,
    "deductionValue" DECIMAL(65,30),
    "publicPension" DECIMAL(65,30),
    "incomeTax" DECIMAL(65,30),
    "otherDeductions" DECIMAL(65,30),
    "foodAllowance" BOOLEAN NOT NULL,
    "foodAllowanceValue" DECIMAL(65,30),
    "transportAllowance" BOOLEAN NOT NULL,
    "transportAllowanceValue" DECIMAL(65,30),
    "expenseReimbursement" BOOLEAN NOT NULL,
    "expenseReimbursementValue" DECIMAL(65,30),
    "advancePayment" BOOLEAN NOT NULL,
    "advancePaymentValue" DECIMAL(65,30),
    "reversals" BOOLEAN NOT NULL,
    "reversalValue" DECIMAL(65,30),
    "compensation" BOOLEAN NOT NULL,
    "compensationValue" DECIMAL(65,30),
    "judicialPension" BOOLEAN NOT NULL,
    "judicialPensionValue" DECIMAL(65,30),

    CONSTRAINT "MonthlyIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "waterSewage" DOUBLE PRECISION,
    "electricity" DOUBLE PRECISION,
    "landlinePhone" DOUBLE PRECISION,
    "mobilePhone" DOUBLE PRECISION,
    "food" DOUBLE PRECISION,
    "rent" DOUBLE PRECISION,
    "garageRent" DOUBLE PRECISION,
    "condominium" DOUBLE PRECISION,
    "cableTV" DOUBLE PRECISION,
    "streamingServices" DOUBLE PRECISION,
    "fuel" DOUBLE PRECISION,
    "annualIPVA" DOUBLE PRECISION,
    "optedForInstallment" BOOLEAN,
    "installmentCount" INTEGER,
    "installmentValue" DOUBLE PRECISION,
    "annualIPTU" DOUBLE PRECISION,
    "annualITR" DOUBLE PRECISION,
    "annualIR" DOUBLE PRECISION,
    "INSS" DOUBLE PRECISION,
    "publicTransport" DOUBLE PRECISION,
    "schoolTransport" DOUBLE PRECISION,
    "internet" DOUBLE PRECISION,
    "courses" DOUBLE PRECISION,
    "healthPlan" DOUBLE PRECISION,
    "dentalPlan" DOUBLE PRECISION,
    "medicationExpenses" DOUBLE PRECISION,
    "otherExpenses" DOUBLE PRECISION,
    "totalExpense" DOUBLE PRECISION,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "familyMemberName" TEXT NOT NULL,
    "installmentValue" DOUBLE PRECISION NOT NULL,
    "totalInstallments" INTEGER NOT NULL,
    "paidInstallments" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financing" (
    "id" TEXT NOT NULL,
    "familyMemberName" TEXT NOT NULL,
    "financingType" TEXT NOT NULL,
    "installmentValue" DOUBLE PRECISION NOT NULL,
    "totalInstallments" INTEGER NOT NULL,
    "paidInstallments" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "Financing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "familyMemberName" TEXT NOT NULL,
    "usersCount" INTEGER NOT NULL,
    "cardType" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "cardFlag" TEXT NOT NULL,
    "invoiceValue" DOUBLE PRECISION NOT NULL,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherExpense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "familyMember_id" TEXT NOT NULL,

    CONSTRAINT "OtherExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familyMemberDiseases" (
    "id" TEXT NOT NULL,
    "familyMember_id" TEXT NOT NULL,
    "disease" "Disease" NOT NULL,
    "specificDisease" TEXT,
    "hasMedicalReport" BOOLEAN NOT NULL,

    CONSTRAINT "familyMemberDiseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" TEXT NOT NULL,
    "familyMemberDisease_id" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "obtainedPublicly" BOOLEAN NOT NULL,
    "specificMedicationPublicly" TEXT,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
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
    "entity_id" TEXT NOT NULL,
    "entity_subsidiary_id" TEXT,

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
CREATE UNIQUE INDEX "candidates_CPF_key" ON "candidates"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_user_id_key" ON "candidates"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "responsibles_CPF_key" ON "responsibles"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "responsibles_user_id_key" ON "responsibles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "assistants_CPF_key" ON "assistants"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "entities_CNPJ_key" ON "entities"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "entities_user_id_key" ON "entities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntitySubsidiary_CNPJ_key" ON "EntitySubsidiary"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "EntitySubsidiary_user_id_key" ON "EntitySubsidiary"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityDirector_CPF_key" ON "EntityDirector"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "EntityDirector_user_id_key" ON "EntityDirector"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "SelectionProcessResponsible_CPF_key" ON "SelectionProcessResponsible"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "SelectionProcessResponsible_user_id_key" ON "SelectionProcessResponsible"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityDetails_RG_key" ON "IdentityDetails"("RG");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityDetails_candidate_id_key" ON "IdentityDetails"("candidate_id");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityDetails_responsible_id_key" ON "IdentityDetails"("responsible_id");

-- CreateIndex
CREATE UNIQUE INDEX "housing_candidate_id_key" ON "housing"("candidate_id");

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsibles" ADD CONSTRAINT "responsibles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistants" ADD CONSTRAINT "assistants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistants" ADD CONSTRAINT "assistants_entity_subsidiary_id_fkey" FOREIGN KEY ("entity_subsidiary_id") REFERENCES "EntitySubsidiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntitySubsidiary" ADD CONSTRAINT "EntitySubsidiary_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntitySubsidiary" ADD CONSTRAINT "EntitySubsidiary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityDirector" ADD CONSTRAINT "EntityDirector_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityDirector" ADD CONSTRAINT "EntityDirector_entity_subsidiary_id_fkey" FOREIGN KEY ("entity_subsidiary_id") REFERENCES "EntitySubsidiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityDirector" ADD CONSTRAINT "EntityDirector_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionProcessResponsible" ADD CONSTRAINT "SelectionProcessResponsible_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionProcessResponsible" ADD CONSTRAINT "SelectionProcessResponsible_entity_subsidiary_id_fkey" FOREIGN KEY ("entity_subsidiary_id") REFERENCES "EntitySubsidiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityDetails" ADD CONSTRAINT "IdentityDetails_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityDetails" ADD CONSTRAINT "IdentityDetails_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familyMembers" ADD CONSTRAINT "familyMembers_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing" ADD CONSTRAINT "housing_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housing" ADD CONSTRAINT "housing_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMemberIncome" ADD CONSTRAINT "FamilyMemberIncome_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_familyMemberIncomeId_fkey" FOREIGN KEY ("familyMemberIncomeId") REFERENCES "FamilyMemberIncome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyIncome" ADD CONSTRAINT "MonthlyIncome_familyMemberIncomeId_fkey" FOREIGN KEY ("familyMemberIncomeId") REFERENCES "FamilyMemberIncome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financing" ADD CONSTRAINT "Financing_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherExpense" ADD CONSTRAINT "OtherExpense_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familyMemberDiseases" ADD CONSTRAINT "familyMemberDiseases_familyMember_id_fkey" FOREIGN KEY ("familyMember_id") REFERENCES "familyMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_familyMemberDisease_id_fkey" FOREIGN KEY ("familyMemberDisease_id") REFERENCES "familyMemberDiseases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_entity_subsidiary_id_fkey" FOREIGN KEY ("entity_subsidiary_id") REFERENCES "EntitySubsidiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationLevel" ADD CONSTRAINT "EducationLevel_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
