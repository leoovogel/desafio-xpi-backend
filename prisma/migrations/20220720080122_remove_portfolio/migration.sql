/*
  Warnings:

  - You are about to drop the column `balance` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `investments` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio_id` on the `investments_history` table. All the data in the column will be lost.
  - You are about to drop the `portfolio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `account_id` to the `investments_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "investments_history" DROP CONSTRAINT "investments_history_portfolio_id_fkey";

-- DropForeignKey
ALTER TABLE "portfolio" DROP CONSTRAINT "portfolio_account_id_fkey";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "balance",
DROP COLUMN "investments",
ADD COLUMN     "balance_value" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "investments_value" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "investments_history" DROP COLUMN "portfolio_id",
ADD COLUMN     "account_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "portfolio";

-- AddForeignKey
ALTER TABLE "investments_history" ADD CONSTRAINT "investments_history_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
