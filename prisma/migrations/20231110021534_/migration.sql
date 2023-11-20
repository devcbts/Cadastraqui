/*
  Warnings:

  - The values [PRIVATE_EMPLOYEE_CLT,PUBLIC_EMPLOYEE,DOMESTIC_EMPLOYEE,TEMPORARY_RURAL_WORKER,RETIRED,PENSIONER,APPRENTICE_INTERN,TEMPORARY_DISABILITY_BENEFIT,MEI,UNEMPLOYED,ENTREPRENEUR,SELF_EMPLOYED_INFORMAL] on the enum `EmploymentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmploymentType_new" AS ENUM ('PrivateEmployee', 'PublicEmployee', 'DomesticEmployee', 'TemporaryRuralEmployee', 'BusinessOwnerSimplifiedTax', 'BusinessOwner', 'IndividualEntrepreneur', 'SelfEmployed', 'Retired', 'Pensioner', 'Apprentice', 'Volunteer', 'RentalIncome', 'Student', 'InformalWorker', 'Unemployed', 'TemporaryDisabilityBenefit', 'LiberalProfessional', 'FinancialHelpFromOthers', 'Alimony', 'PrivatePension');
ALTER TABLE "FamilyMemberIncome" ALTER COLUMN "employmentType" TYPE "EmploymentType_new" USING ("employmentType"::text::"EmploymentType_new");
ALTER TYPE "EmploymentType" RENAME TO "EmploymentType_old";
ALTER TYPE "EmploymentType_new" RENAME TO "EmploymentType";
DROP TYPE "EmploymentType_old";
COMMIT;
