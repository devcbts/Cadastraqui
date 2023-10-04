-- AlterTable
ALTER TABLE "candidates" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dependents" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "responsibles" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL;
