-- AlterTable
ALTER TABLE "candidates" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "UF" DROP NOT NULL,
ALTER COLUMN "CEP" DROP NOT NULL,
ALTER COLUMN "neighborhood" DROP NOT NULL,
ALTER COLUMN "number_of_address" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;
