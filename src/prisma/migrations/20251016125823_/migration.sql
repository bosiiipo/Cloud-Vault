/*
  Warnings:

  - The values [DELETED] on the enum `FileStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [APPEALED] on the enum `ReviewVerdict` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FileStatus_new" AS ENUM ('ACTIVE', 'FLAGGED', 'UNSAFE');
ALTER TABLE "File" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "File" ALTER COLUMN "status" TYPE "FileStatus_new" USING ("status"::text::"FileStatus_new");
ALTER TYPE "FileStatus" RENAME TO "FileStatus_old";
ALTER TYPE "FileStatus_new" RENAME TO "FileStatus";
DROP TYPE "FileStatus_old";
ALTER TABLE "File" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReviewVerdict_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "FileReview" ALTER COLUMN "verdict" DROP DEFAULT;
ALTER TABLE "FileReview" ALTER COLUMN "verdict" TYPE "ReviewVerdict_new" USING ("verdict"::text::"ReviewVerdict_new");
ALTER TYPE "ReviewVerdict" RENAME TO "ReviewVerdict_old";
ALTER TYPE "ReviewVerdict_new" RENAME TO "ReviewVerdict";
DROP TYPE "ReviewVerdict_old";
ALTER TABLE "FileReview" ALTER COLUMN "verdict" SET DEFAULT 'PENDING';
COMMIT;
