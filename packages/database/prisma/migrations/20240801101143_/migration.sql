/*
  Warnings:

  - A unique constraint covering the columns `[role]` on the table `ResourceRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ResourceRole_role_key" ON "ResourceRole"("role");
