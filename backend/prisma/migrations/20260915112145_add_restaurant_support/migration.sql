/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,date]` on the table `DailyMenu` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DailyMenu_date_key";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "restaurantId" TEXT;

-- AlterTable
ALTER TABLE "DailyMenu" ADD COLUMN     "restaurantId" TEXT;

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "restaurantId" TEXT;

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- CreateIndex
CREATE INDEX "DailyMenu_restaurantId_idx" ON "DailyMenu"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyMenu_restaurantId_date_key" ON "DailyMenu"("restaurantId", "date");

-- CreateIndex
CREATE INDEX "Menu_restaurantId_idx" ON "Menu"("restaurantId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMenu" ADD CONSTRAINT "DailyMenu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
