/*
  Warnings:

  - You are about to drop the column `Avatar` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Avatar",
ADD COLUMN     "avatar" TEXT;
