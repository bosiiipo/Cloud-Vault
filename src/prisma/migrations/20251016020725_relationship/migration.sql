-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('ACTIVE', 'FLAGGED', 'UNSAFE', 'DELETED');

-- CreateEnum
CREATE TYPE "ReviewVerdict" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'APPEALED');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "flaggedAt" TIMESTAMP(3),
ADD COLUMN     "isFlagged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'ACTIVE';
