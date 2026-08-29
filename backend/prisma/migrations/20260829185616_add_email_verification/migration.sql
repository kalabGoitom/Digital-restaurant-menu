-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCodeExpiry" TIMESTAMP(3),
ADD COLUMN     "verificationCodeHash" TEXT,
ALTER COLUMN "role" SET DEFAULT 'Admin';
