-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'CANDIDATE', 'RESPONSIBLE');

-- CreateEnum
CREATE TYPE "COUNTRY" AS ENUM ('AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO');

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "UF" "COUNTRY" NOT NULL,
    "CEP" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "number_of_address" INTEGER NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'CANDIDATE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'CANDIDATE',
    "reference_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsibles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "UF" "COUNTRY" NOT NULL,
    "CEP" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "number_of_address" INTEGER NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'RESPONSIBLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responsibles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "responsible_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dependents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_CPF_key" ON "candidates"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_reference_id_key" ON "users"("reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "responsibles_CPF_key" ON "responsibles"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "dependents_CPF_key" ON "dependents"("CPF");

-- AddForeignKey
ALTER TABLE "dependents" ADD CONSTRAINT "dependents_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "responsibles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
