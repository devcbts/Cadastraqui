/*
  Warnings:

  - A unique constraint covering the columns `[candidate_id]` on the table `IdentityDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[responsible_id]` on the table `IdentityDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IdentityDetails_candidate_id_key" ON "IdentityDetails"("candidate_id");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityDetails_responsible_id_key" ON "IdentityDetails"("responsible_id");
