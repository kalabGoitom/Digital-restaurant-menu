-- AlterTable
ALTER TABLE "PlatformAdmin" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCodeExpiry" TIMESTAMP(3),
ADD COLUMN     "verificationCodeHash" TEXT;
