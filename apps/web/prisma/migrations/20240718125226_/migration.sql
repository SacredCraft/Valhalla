/*
  Warnings:

  - You are about to drop the `PluginPath` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PluginPath";

-- CreateTable
CREATE TABLE "ResourcePath" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "ResourcePath_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResourcePath_name_key" ON "ResourcePath"("name");
