/*
  Warnings:

  - You are about to drop the column `reference_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `responsibles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_reference_id_key";

-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "responsibles" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "reference_id";

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsibles" ADD CONSTRAINT "responsibles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
