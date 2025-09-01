-- AlterTable
ALTER TABLE "public"."Bot" ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'disconnected',
ADD COLUMN     "webhookUrl" TEXT;
