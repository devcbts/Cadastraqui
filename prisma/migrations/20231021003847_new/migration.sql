-- CreateEnum
CREATE TYPE "SolicitationType" AS ENUM ('Document', 'Interview', 'Visit');

-- AlterTable
ALTER TABLE "ApplicationHistory" ADD COLUMN     "deadLine" TIMESTAMP(3),
ADD COLUMN     "solicitation" "SolicitationType";

-- AlterTable
ALTER TABLE "EducationLevel" ADD COLUMN     "grade" TEXT;
