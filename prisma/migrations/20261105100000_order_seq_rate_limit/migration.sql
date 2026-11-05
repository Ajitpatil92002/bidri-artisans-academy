-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "seq" SERIAL NOT NULL;

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_seq_key" ON "Order"("seq");

