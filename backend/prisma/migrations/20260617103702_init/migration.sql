-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('E', 'D', 'C', 'B', 'A', 'S', 'NATIONAL');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('E', 'D', 'C', 'B', 'A', 'S');

-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('pending', 'active', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('none', 'daily', 'weekly');

-- CreateEnum
CREATE TYPE "StatType" AS ENUM ('STR', 'AGI', 'INT', 'VIT', 'SENSE');

-- CreateEnum
CREATE TYPE "DungeonStatus" AS ENUM ('active', 'cleared');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hunter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "xpToNextLevel" INTEGER NOT NULL DEFAULT 100,
    "rank" "Rank" NOT NULL DEFAULT 'E',
    "jobClass" TEXT NOT NULL DEFAULT 'Beginner',
    "statStrength" INTEGER NOT NULL DEFAULT 0,
    "statAgility" INTEGER NOT NULL DEFAULT 0,
    "statIntelligence" INTEGER NOT NULL DEFAULT 0,
    "statVitality" INTEGER NOT NULL DEFAULT 0,
    "statSense" INTEGER NOT NULL DEFAULT 0,
    "statPointsAvailable" INTEGER NOT NULL DEFAULT 0,
    "totalQuestsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalDungeonsCleared" INTEGER NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hunter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "hunterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'E',
    "status" "QuestStatus" NOT NULL DEFAULT 'pending',
    "xpReward" INTEGER NOT NULL,
    "coinReward" INTEGER NOT NULL,
    "statType" "StatType" NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "isDaily" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" "Recurrence" NOT NULL DEFAULT 'none',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dungeon" (
    "id" TEXT NOT NULL,
    "hunterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "rank" "Rank" NOT NULL,
    "status" "DungeonStatus" NOT NULL DEFAULT 'active',
    "totalTasks" INTEGER NOT NULL DEFAULT 0,
    "completedTasks" INTEGER NOT NULL DEFAULT 0,
    "xpReward" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clearedAt" TIMESTAMP(3),

    CONSTRAINT "Dungeon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DungeonTask" (
    "id" TEXT NOT NULL,
    "dungeonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DungeonTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shadow" (
    "id" TEXT NOT NULL,
    "hunterId" TEXT NOT NULL,
    "habitName" TEXT NOT NULL,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "isAwakened" BOOLEAN NOT NULL DEFAULT false,
    "icon" TEXT,
    "lastChecked" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shadow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" TEXT NOT NULL,
    "hunterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "costCoins" INTEGER NOT NULL,
    "isPurchased" BOOLEAN NOT NULL DEFAULT false,
    "purchasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "hunterId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Hunter_userId_key" ON "Hunter"("userId");

-- AddForeignKey
ALTER TABLE "Hunter" ADD CONSTRAINT "Hunter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_hunterId_fkey" FOREIGN KEY ("hunterId") REFERENCES "Hunter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dungeon" ADD CONSTRAINT "Dungeon_hunterId_fkey" FOREIGN KEY ("hunterId") REFERENCES "Hunter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonTask" ADD CONSTRAINT "DungeonTask_dungeonId_fkey" FOREIGN KEY ("dungeonId") REFERENCES "Dungeon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shadow" ADD CONSTRAINT "Shadow_hunterId_fkey" FOREIGN KEY ("hunterId") REFERENCES "Hunter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopItem" ADD CONSTRAINT "ShopItem_hunterId_fkey" FOREIGN KEY ("hunterId") REFERENCES "Hunter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_hunterId_fkey" FOREIGN KEY ("hunterId") REFERENCES "Hunter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
