/*
  Warnings:

  - You are about to alter the column `balance` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,2)` to `Decimal(10,2)`.
  - You are about to alter the column `investments` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,2)` to `Decimal(10,2)`.
  - You are about to drop the column `quantity` on the `assets` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `assets` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,2)` to `Decimal(10,2)`.
  - You are about to drop the `account_assets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `available_quantity` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "account_assets" DROP CONSTRAINT "account_assets_account_id_fkey";

-- DropForeignKey
ALTER TABLE "account_assets" DROP CONSTRAINT "account_assets_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_id_fkey";

-- DropIndex
DROP INDEX "assets_symbol_key";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "investments" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "assets" DROP COLUMN "quantity",
ADD COLUMN     "available_quantity" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- DropTable
DROP TABLE "account_assets";

-- DropTable
DROP TABLE "transactions";

-- CreateTable
CREATE TABLE "transactions_history" (
    "id" SERIAL NOT NULL,
    "account_id" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "transaction_type" "transaction_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "average_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments_history" (
    "id" SERIAL NOT NULL,
    "portfolio_id" TEXT NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "investment_type" "investment_type" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investments_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions_history" ADD CONSTRAINT "transactions_history_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments_history" ADD CONSTRAINT "investments_history_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments_history" ADD CONSTRAINT "investments_history_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
