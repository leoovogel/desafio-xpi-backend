/*
  Warnings:

  - You are about to drop the column `average_price` on the `portfolio` table. All the data in the column will be lost.
  - Added the required column `acquisition_value` to the `portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `average_purchase_price` to the `portfolio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_value` to the `portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "portfolio" DROP COLUMN "average_price",
ADD COLUMN     "acquisition_value" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "average_purchase_price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "current_value" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "profitability_percentage" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "profitability_value" DECIMAL(10,2) NOT NULL DEFAULT 0;
