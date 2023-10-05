-- DropForeignKey
ALTER TABLE "candidates" DROP CONSTRAINT "candidates_user_id_fkey";

-- AlterTable
ALTER TABLE "candidates" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
