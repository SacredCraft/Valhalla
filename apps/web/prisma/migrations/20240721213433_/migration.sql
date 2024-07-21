-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceRole" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "resources" TEXT[],

    CONSTRAINT "ResourceRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserResourceRole" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceRoleId" INTEGER NOT NULL,

    CONSTRAINT "UserResourceRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourcePath" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "ResourcePath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "action" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LogOperators" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ResourcePath_name_key" ON "ResourcePath"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_LogOperators_AB_unique" ON "_LogOperators"("A", "B");

-- CreateIndex
CREATE INDEX "_LogOperators_B_index" ON "_LogOperators"("B");

-- AddForeignKey
ALTER TABLE "UserResourceRole" ADD CONSTRAINT "UserResourceRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResourceRole" ADD CONSTRAINT "UserResourceRole_resourceRoleId_fkey" FOREIGN KEY ("resourceRoleId") REFERENCES "ResourceRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LogOperators" ADD CONSTRAINT "_LogOperators_A_fkey" FOREIGN KEY ("A") REFERENCES "Log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LogOperators" ADD CONSTRAINT "_LogOperators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
