import prisma from '../prisma.js'
import { calculateQuestReward, applyXPToHunter } from '../services/xpService.js'

const getHunter = async (userId) => prisma.hunter.findUnique({ where: { userId } })

const listDungeons = async (req, res) => {
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const dungeons = await prisma.dungeon.findMany({
    where: { hunterId: hunter.id },
    orderBy: { createdAt: 'desc' },
  })

  res.json({ dungeons })
}

const createDungeon = async (req, res) => {
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const { title, description, rank = 'C', deadline, xpReward = 800 } = req.body
  const due = deadline ? new Date(deadline) : null

  const dungeon = await prisma.dungeon.create({
    data: {
      hunterId: hunter.id,
      title,
      description,
      rank,
      status: 'active',
      totalTasks: 0,
      completedTasks: 0,
      xpReward,
      deadline: due,
    },
  })

  res.status(201).json({ dungeon })
}

const getDungeon = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const dungeon = await prisma.dungeon.findUnique({
    where: { id },
    include: { tasks: { orderBy: { orderIndex: 'asc' } } },
  })

  if (!dungeon || dungeon.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Dungeon not found' })
  }

  res.json({ dungeon })
}

const updateDungeon = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const dungeon = await prisma.dungeon.findUnique({ where: { id } })
  if (!dungeon || dungeon.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Dungeon not found' })
  }

  const data = { ...req.body }
  if (data.deadline) data.deadline = new Date(data.deadline)

  const updated = await prisma.dungeon.update({ where: { id }, data })
  res.json({ dungeon: updated })
}

const addTask = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const dungeon = await prisma.dungeon.findUnique({ where: { id } })
  if (!dungeon || dungeon.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Dungeon not found' })
  }

  const { title, orderIndex } = req.body
  const task = await prisma.dungeonTask.create({
    data: {
      dungeonId: dungeon.id,
      title,
      orderIndex: orderIndex ?? dungeon.totalTasks,
    },
  })

  await prisma.dungeon.update({
    where: { id: dungeon.id },
    data: { totalTasks: { increment: 1 } },
  })

  res.status(201).json({ task })
}

const completeTask = async (req, res) => {
  const { id, taskId } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const dungeon = await prisma.dungeon.findUnique({ where: { id } })
  if (!dungeon || dungeon.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Dungeon not found' })
  }

  const task = await prisma.dungeonTask.findUnique({ where: { id: taskId } })
  if (!task || task.dungeonId !== dungeon.id) {
    return res.status(404).json({ error: 'Task not found' })
  }

  if (task.isCompleted) {
    return res.status(400).json({ error: 'Task is already completed' })
  }

  await prisma.$transaction([
    prisma.dungeonTask.update({
      where: { id: taskId },
      data: { isCompleted: true, completedAt: new Date() },
    }),
    prisma.dungeon.update({
      where: { id: dungeon.id },
      data: { completedTasks: { increment: 1 } },
    }),
  ])

  const updatedDungeon = await prisma.dungeon.findUnique({ where: { id: dungeon.id } })
  if (updatedDungeon.completedTasks >= updatedDungeon.totalTasks && updatedDungeon.totalTasks > 0) {
    await prisma.dungeon.update({
      where: { id: dungeon.id },
      data: { status: 'cleared', clearedAt: new Date() },
    })
  }

  res.json({ task: { ...task, isCompleted: true }, dungeon: updatedDungeon })
}

const clearDungeon = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const dungeon = await prisma.dungeon.findUnique({ where: { id }, include: { tasks: true } })
  if (!dungeon || dungeon.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Dungeon not found' })
  }

  if (dungeon.status === 'cleared') {
    return res.status(400).json({ error: 'Dungeon already cleared' })
  }

  const reward = calculateQuestReward(dungeon.rank, hunter.streakDays, new Date())
  const xpResult = applyXPToHunter(hunter, reward.xp)

  await prisma.$transaction([
    prisma.dungeon.update({
      where: { id: dungeon.id },
      data: { status: 'cleared', clearedAt: new Date() },
    }),
    prisma.hunter.update({
      where: { id: hunter.id },
      data: {
        xp: xpResult.xp,
        level: xpResult.level,
        rank: xpResult.rank,
        xpToNextLevel: xpResult.xpToNextLevel,
        coins: { increment: reward.coins },
        totalDungeonsCleared: { increment: 1 },
      },
    }),
  ])

  res.json({ xp_gained: reward.xp, coins_gained: reward.coins, new_level: xpResult.level, rank_up: xpResult.rankUp, new_rank: xpResult.rank })
}

export { listDungeons, createDungeon, getDungeon, updateDungeon, addTask, completeTask, clearDungeon }
