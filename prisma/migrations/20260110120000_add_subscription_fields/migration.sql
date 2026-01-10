-- Add subscription fields to LavaJato
ALTER TABLE "LavaJato" ADD COLUMN IF NOT EXISTS "plano" TEXT NOT NULL DEFAULT 'STARTER';
ALTER TABLE "LavaJato" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
ALTER TABLE "LavaJato" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;
ALTER TABLE "LavaJato" ADD COLUMN IF NOT EXISTS "stripePriceId" TEXT;
ALTER TABLE "LavaJato" ADD COLUMN IF NOT EXISTS "stripeStatus" TEXT;
ALTER TABLE "LavaJato" ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);
ALTER TABLE "LavaJato" ADD COLUMN IF NOT EXISTS "currentPeriodEnd" TIMESTAMP(3);
ALTER TABLE "LavaJato" ADD COLUMN IF NOT EXISTS "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "LavaJato_stripeCustomerId_key" ON "LavaJato"("stripeCustomerId");
CREATE UNIQUE INDEX IF NOT EXISTS "LavaJato_stripeSubscriptionId_key" ON "LavaJato"("stripeSubscriptionId");

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "LavaJato_stripeCustomerId_idx" ON "LavaJato"("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "LavaJato_plano_idx" ON "LavaJato"("plano");

