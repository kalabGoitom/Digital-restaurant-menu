-- DropForeignKey
ALTER TABLE "DailyMenuItem" DROP CONSTRAINT "DailyMenuItem_dailyMenuId_fkey";

-- DropForeignKey
ALTER TABLE "DailyMenuItem" DROP CONSTRAINT "DailyMenuItem_menuId_fkey";

-- AddForeignKey
ALTER TABLE "DailyMenuItem" ADD CONSTRAINT "DailyMenuItem_dailyMenuId_fkey" FOREIGN KEY ("dailyMenuId") REFERENCES "DailyMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMenuItem" ADD CONSTRAINT "DailyMenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
