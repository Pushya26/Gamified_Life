import prisma from '../prisma.js'
import { calculateQuestReward, applyXPToHunter } from '../services/xpService.js'

const statFieldMap = {
  STR: 'statStrength',
  AGI: 'statAgility',
  INT: 'statIntelligence',
  VIT: 'statVitality',
  SENSE: 'statSense',
}

const getHunter = async (userId) => prisma.hunter.findUnique({ where: { userId } })

const listQuests = async (req, res) => {
  const { status, difficulty, date } = req.query
  const hunter = await getHunter(req.user.userId)

  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const where = { hunterId: hunter.id }
  if (status) where.status = status
  if (difficulty) where.difficulty = difficulty
  if (date) {
    const lower = new Date(date)
    lower.setHours(0, 0, 0, 0)
    const upper = new Date(date)
    upper.setHours(23, 59, 59, 999)
    where.dueDate = { gte: lower, lte: upper }
  }

  const quests = await prisma.quest.findMany({ where, orderBy: { dueDate: 'asc' } })
  res.json({ quests })
}

const createQuest = async (req, res) => {
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const {
    title,
    description,
    difficulty = 'E',
    status = 'pending',
    xpReward,
    coinReward,
    statType = 'STR',
    dueDate,
    isDaily = false,
    recurrence = 'none',
  } = req.body

  const quest = await prisma.quest.create({
    data: {
      hunterId: hunter.id,
      title,
      description,
      difficulty,
      status,
      xpReward,
      coinReward,
      statType,
      dueDate: dueDate ? new Date(dueDate) : null,
      isDaily,
      recurrence,
    },
  })

  res.status(201).json({ quest })
}

const updateQuest = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const quest = await prisma.quest.findUnique({ where: { id } })
  if (!quest || quest.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Quest not found' })
  }

  const updateData = { ...req.body }
  if (req.body.dueDate) updateData.dueDate = new Date(req.body.dueDate)

  const updated = await prisma.quest.update({ where: { id }, data: updateData })
  res.json({ quest: updated })
}

const deleteQuest = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const quest = await prisma.quest.findUnique({ where: { id } })
  if (!quest || quest.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Quest not found' })
  }

  await prisma.quest.delete({ where: { id } })
  res.status(204).send()
}

const completeQuest = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const quest = await prisma.quest.findUnique({ where: { id } })
  if (!quest || quest.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Quest not found' })
  }

  if (quest.status === 'completed') {
    return res.status(400).json({ error: 'Quest already completed' })
  }

  const completedAt = new Date()
  const reward = calculateQuestReward(quest.difficulty, hunter.streakDays, completedAt)
  const xpResult = applyXPToHunter(hunter, reward.xp)
  const statField = statFieldMap[quest.statType] || 'statStrength'

  await prisma.$transaction([
    prisma.quest.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt,
      },
    }),
    prisma.hunter.update({
      where: { id: hunter.id },
      data: {
        xp: xpResult.xp,
        level: xpResult.level,
        rank: xpResult.rank,
        xpToNextLevel: xpResult.xpToNextLevel,
        coins: { increment: reward.coins },
        totalQuestsCompleted: { increment: 1 },
        [statField]: { increment: 1 },
      },
    }),
  ])

  res.json({
    xp_gained: reward.xp,
    coins_gained: reward.coins,
    new_xp: xpResult.xp,
    new_level: xpResult.level,
    level_up: xpResult.levelUp,
    new_rank: xpResult.rank,
    rank_up: xpResult.rankUp,
  })
}

const failQuest = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const quest = await prisma.quest.findUnique({ where: { id } })
  if (!quest || quest.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Quest not found' })
  }

  const updated = await prisma.quest.update({
    where: { id },
    data: { status: 'failed' },
  })

  res.json({ quest: updated })
}

const getDailyQuests = async (req, res) => {
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const quests = await prisma.quest.findMany({
    where: {
      hunterId: hunter.id,
      isDaily: true,
      dueDate: { gte: todayStart, lte: todayEnd },
    },
    orderBy: { dueDate: 'asc' },
  })

  res.json({ quests })
}

const generateDailyQuests = async (req, res) => {
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const templates = [
    {
      title: 'Morning focus session',
      description: 'Complete a focused study or training block before lunch.',
      difficulty: 'C',
      xpReward: 100,
      coinReward: 25,
      statType: 'AGI',
    },
    {
      title: 'Hydration and recovery',
      description: 'Drink water and take a 15-minute break.',
      difficulty: 'D',
      xpReward: 50,
      coinReward: 10,
      statType: 'VIT',
    },
    {
      title: 'Study a shadow spell',
      description: 'Learn something new in your niche discipline.',
      difficulty: 'B',
      xpReward: 200,
      coinReward: 50,
      statType: 'INT',
    },
  ]

  const quests = await Promise.all(
    templates.map((template) =>
      prisma.quest.create({
        data: {
          hunterId: hunter.id,
          title: template.title,
          description: template.description,
          difficulty: template.difficulty,
          status: 'active',
          xpReward: template.xpReward,
          coinReward: template.coinReward,
          statType: template.statType,
          dueDate: today,
          isDaily: true,
          recurrence: 'daily',
        },
      }),
    ),
  )

  res.status(201).json({ quests })
}

export { listQuests, createQuest, updateQuest, deleteQuest, completeQuest, failQuest, getDailyQuests, generateDailyQuests }
