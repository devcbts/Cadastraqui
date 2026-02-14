-- CreateEnum
CREATE TYPE "StudentImportBatchStatus" AS ENUM ('PROCESSING', 'SUCCESS', 'PARTIAL', 'FAILED');

-- CreateEnum
CREATE TYPE "StudentImportItemStatus" AS ENUM ('CREATED', 'SKIPPED', 'ERROR');

-- CreateTable
CREATE TABLE "import_batch_students" (
    "id" TEXT NOT NULL,
    "fileName" TEXT,
    "delimiter" TEXT,
    "status" "StudentImportBatchStatus" NOT NULL DEFAULT 'PROCESSING',
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "processedRows" INTEGER NOT NULL DEFAULT 0,
    "successRows" INTEGER NOT NULL DEFAULT 0,
    "errorRows" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdByUserId" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_batch_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_batch_items_students" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "status" "StudentImportItemStatus" NOT NULL,
    "errorMessage" TEXT,
    "rawData" JSONB,
    "candidateCpf" TEXT,
    "candidateEmail" TEXT,
    "candidate_id" TEXT,
    "student_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_batch_items_students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_batch_students_entity_id_createdAt_idx" ON "import_batch_students"("entity_id", "createdAt");

-- CreateIndex
CREATE INDEX "import_batch_students_createdByUserId_createdAt_idx" ON "import_batch_students"("createdByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "import_batch_students_status_createdAt_idx" ON "import_batch_students"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "import_batch_items_students_batch_id_lineNumber_key" ON "import_batch_items_students"("batch_id", "lineNumber");

-- CreateIndex
CREATE INDEX "import_batch_items_students_batch_id_status_idx" ON "import_batch_items_students"("batch_id", "status");

-- CreateIndex
CREATE INDEX "import_batch_items_students_candidateCpf_idx" ON "import_batch_items_students"("candidateCpf");

-- AddForeignKey
ALTER TABLE "import_batch_students" ADD CONSTRAINT "import_batch_students_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_batch_students" ADD CONSTRAINT "import_batch_students_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_batch_items_students" ADD CONSTRAINT "import_batch_items_students_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "import_batch_students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_batch_items_students" ADD CONSTRAINT "import_batch_items_students_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_batch_items_students" ADD CONSTRAINT "import_batch_items_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
