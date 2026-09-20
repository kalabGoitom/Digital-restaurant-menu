/*
  Warnings:

  - Made the column `restaurantId` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `restaurantId` on table `DailyMenu` required. This step will fail if there are existing NULL values in that column.
  - Made the column `restaurantId` on table `Menu` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "restaurantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "DailyMenu" ALTER COLUMN "restaurantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "restaurantId" SET NOT NULL;
