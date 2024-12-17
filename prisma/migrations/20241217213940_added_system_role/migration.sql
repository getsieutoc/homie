/*
  Warnings:

  - The values [ADMIN] on the enum `MembershipRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('ADMIN', 'CUSTOMER');

-- AlterEnum
BEGIN;
CREATE TYPE "MembershipRole_new" AS ENUM ('OWNER', 'MANAGER', 'MEMBER');
ALTER TABLE "Membership" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "role" TYPE "MembershipRole_new" USING ("role"::text::"MembershipRole_new");
ALTER TYPE "MembershipRole" RENAME TO "MembershipRole_old";
ALTER TYPE "MembershipRole_new" RENAME TO "MembershipRole";
DROP TYPE "MembershipRole_old";
ALTER TABLE "Membership" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "SystemRole" NOT NULL DEFAULT 'CUSTOMER';
