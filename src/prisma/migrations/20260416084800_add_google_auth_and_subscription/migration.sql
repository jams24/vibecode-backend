-- Make passwordHash nullable (Google users don't have one)
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- Add Google Sign-In columns
ALTER TABLE "User" ADD COLUMN "authProvider" TEXT NOT NULL DEFAULT 'email';
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;

-- Add onboarding columns
ALTER TABLE "User" ADD COLUMN "experienceLevel" TEXT;
ALTER TABLE "User" ADD COLUMN "buildGoals" TEXT;

-- Add subscription columns
ALTER TABLE "User" ADD COLUMN "trialStartDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT NOT NULL DEFAULT 'trial';
ALTER TABLE "User" ADD COLUMN "subscriptionExpiresAt" TIMESTAMP(3);

-- Unique index for googleId
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
