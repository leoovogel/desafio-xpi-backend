-- CreateTable
CREATE TABLE "portfolio" (
    "id" SERIAL NOT NULL,
    "account_id" TEXT NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "average_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_account_id_asset_id_key" ON "portfolio"("account_id", "asset_id");

-- AddForeignKey
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
