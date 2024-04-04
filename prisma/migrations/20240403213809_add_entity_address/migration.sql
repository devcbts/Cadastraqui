-- AlterTable
ALTER TABLE "entities" ADD COLUMN     "addressNumber" INTEGER,
ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "neighborhood" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "address" SET DEFAULT '';
