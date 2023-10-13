-- AlterTable
ALTER TABLE "EntityDirector" ADD COLUMN     "entity_id" TEXT;

-- AddForeignKey
ALTER TABLE "EntityDirector" ADD CONSTRAINT "EntityDirector_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
