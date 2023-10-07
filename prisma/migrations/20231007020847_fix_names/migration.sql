/*
  Warnings:

  - You are about to drop the column `complement` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `EntitySubsidiary` table. All the data in the column will be lost.
  - Added the required column `UF` to the `EntitySubsidiary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressNumber` to the `EntitySubsidiary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntitySubsidiary" DROP COLUMN "complement",
DROP COLUMN "country",
DROP COLUMN "number",
ADD COLUMN     "UF" "COUNTRY" NOT NULL,
ADD COLUMN     "addressComplement" TEXT,
ADD COLUMN     "addressNumber" TEXT NOT NULL;
