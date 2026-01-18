/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refresh_token_hash]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refresh_token_hash` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_refresh_token_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "refresh_token",
ADD COLUMN     "refresh_token_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_refresh_token_hash_key" ON "Session"("refresh_token_hash");
