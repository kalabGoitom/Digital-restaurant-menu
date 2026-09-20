-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateTable
CREATE TABLE "RestaurantInvitation" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantInvitation_tokenHash_key" ON "RestaurantInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "RestaurantInvitation_restaurantId_idx" ON "RestaurantInvitation"("restaurantId");

-- CreateIndex
CREATE INDEX "RestaurantInvitation_expiresAt_idx" ON "RestaurantInvitation"("expiresAt");

-- AddForeignKey
ALTER TABLE "RestaurantInvitation" ADD CONSTRAINT "RestaurantInvitation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
