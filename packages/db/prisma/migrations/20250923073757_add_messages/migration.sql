-- CreateEnum
CREATE TYPE "public"."StepType" AS ENUM ('TEXT', 'PHOTO', 'DOCUMENT', 'VIDEO');

-- CreateEnum
CREATE TYPE "public"."ParseMode" AS ENUM ('NONE', 'MarkdownV2', 'HTML');

-- AlterTable
ALTER TABLE "public"."Bot" ADD COLUMN     "welcomeMessageId" TEXT;

-- CreateTable
CREATE TABLE "public"."MessageTemplate" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "locale" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageStep" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "public"."StepType" NOT NULL,
    "parseMode" "public"."ParseMode" NOT NULL DEFAULT 'NONE',
    "text" TEXT,
    "mediaUrl" TEXT,
    "fileId" TEXT,
    "disablePreview" BOOLEAN NOT NULL DEFAULT true,
    "keyboardJson" JSONB,
    "delayMs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_template_bot_id" ON "public"."MessageTemplate"("botId");

-- CreateIndex
CREATE INDEX "idx_template_updated_at" ON "public"."MessageTemplate"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_step_template_order" ON "public"."MessageStep"("templateId", "order");

-- CreateIndex
CREATE INDEX "idx_bot_welcome_message_id" ON "public"."Bot"("welcomeMessageId");

-- AddForeignKey
ALTER TABLE "public"."Bot" ADD CONSTRAINT "Bot_welcomeMessageId_fkey" FOREIGN KEY ("welcomeMessageId") REFERENCES "public"."MessageTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageTemplate" ADD CONSTRAINT "MessageTemplate_botId_fkey" FOREIGN KEY ("botId") REFERENCES "public"."Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageStep" ADD CONSTRAINT "MessageStep_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."MessageTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
