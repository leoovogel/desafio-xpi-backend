/*
  Warnings:

  - You are about to drop the column `balance_value` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "balance_value",
ADD COLUMN     "available_balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "total_assets" DECIMAL(10,2) NOT NULL DEFAULT 0;
