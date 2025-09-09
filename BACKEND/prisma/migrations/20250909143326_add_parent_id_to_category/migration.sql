/*
  Warnings:

  - The `parentId` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "parentId",
ADD COLUMN     "parentId" UUID;
