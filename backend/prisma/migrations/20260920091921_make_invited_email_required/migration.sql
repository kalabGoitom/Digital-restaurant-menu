/*
  Warnings:

  - Made the column `invitedEmail` on table `RestaurantInvitation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RestaurantInvitation" ALTER COLUMN "invitedEmail" SET NOT NULL;
