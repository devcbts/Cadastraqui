/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_owner_id_fkey";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "owner_id";

-- CreateTable
CREATE TABLE "_FamilyMemberToVehicle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FamilyMemberToVehicle_AB_unique" ON "_FamilyMemberToVehicle"("A", "B");

-- CreateIndex
CREATE INDEX "_FamilyMemberToVehicle_B_index" ON "_FamilyMemberToVehicle"("B");

-- AddForeignKey
ALTER TABLE "_FamilyMemberToVehicle" ADD CONSTRAINT "_FamilyMemberToVehicle_A_fkey" FOREIGN KEY ("A") REFERENCES "familyMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamilyMemberToVehicle" ADD CONSTRAINT "_FamilyMemberToVehicle_B_fkey" FOREIGN KEY ("B") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
