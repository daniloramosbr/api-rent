/*
  Warnings:

  - Added the required column `name` to the `Rent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rent" ADD COLUMN     "name" TEXT NOT NULL;
