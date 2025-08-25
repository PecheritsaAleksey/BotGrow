-- CreateTable
CREATE TABLE "Bot" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "encryptedToken" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "tokenLast4" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Bot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Bot_userId_idx" ON "Bot"("userId");
-- CreateIndex
CREATE INDEX "Bot_tokenHash_idx" ON "Bot"("tokenHash");
