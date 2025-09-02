-- CreateTable
CREATE TABLE "public"."Subscriber" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "telegramId" INTEGER NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "language" TEXT,
    "photoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subscriber_botId_idx" ON "public"."Subscriber"("botId");

-- CreateIndex
CREATE INDEX "Subscriber_botId_lastSeenAt_idx" ON "public"."Subscriber"("botId", "lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_botId_telegramId_key" ON "public"."Subscriber"("botId", "telegramId");

-- AddForeignKey
ALTER TABLE "public"."Subscriber" ADD CONSTRAINT "Subscriber_botId_fkey" FOREIGN KEY ("botId") REFERENCES "public"."Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
