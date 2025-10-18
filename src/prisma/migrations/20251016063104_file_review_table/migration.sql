/*
  Warnings:

  - You are about to drop the column `reviewVerdict` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "reviewVerdict";

-- CreateTable
CREATE TABLE "FileReview" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "verdict" "ReviewVerdict" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileReview_fileId_idx" ON "FileReview"("fileId");

-- CreateIndex
CREATE INDEX "FileReview_adminId_idx" ON "FileReview"("adminId");

-- CreateIndex
CREATE INDEX "FileReview_verdict_idx" ON "FileReview"("verdict");

-- AddForeignKey
ALTER TABLE "FileReview" ADD CONSTRAINT "FileReview_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileReview" ADD CONSTRAINT "FileReview_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
