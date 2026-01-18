/*
  Warnings:

  - Added the required column `updated_at` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "is_revoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_agent" TEXT;

-- CreateIndex
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");
