/*
  Warnings:

  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId,domain]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domain` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MembershipStatus" ADD VALUE 'JOINED';

-- DropIndex
DROP INDEX "Project_tenantId_idx";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "deleledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "name",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "scheduleId" TEXT,
ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disputedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "lastMessage" TEXT,
    "disputeCount" INTEGER NOT NULL DEFAULT 0,
    "engineName" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "category" TEXT,
    "method" TEXT,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "tenantId" TEXT,
    "engineName" TEXT NOT NULL,
    "email" TEXT,
    "url" TEXT,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_projectId_engineName_key" ON "Result"("projectId", "engineName");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_engineName_key" ON "Vendor"("engineName");

-- CreateIndex
CREATE UNIQUE INDEX "Project_tenantId_domain_key" ON "Project"("tenantId", "domain");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_engineName_fkey" FOREIGN KEY ("engineName") REFERENCES "Vendor"("engineName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
