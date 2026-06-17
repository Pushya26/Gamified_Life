import prisma from '../prisma.js'
import { getRankFromLevel } from '../utils/rankUtils.js'

const statFieldMap = {
  STR: 'statStrength',
  AGI: 'statAgility',
  INT: 'statIntelligence',
  VIT: 'statVitality',
  SENSE: 'statSense',
}

const getStatus = async (req, res) => {
  const hunter = await prisma.hunter.findUnique({
    where: { userId: req.user.userId },
    include: { user: true },
  })

  if (!hunter) {
    return res.status(404).json({ error: 'Hunter profile not found' })
  }

  res.json({ hunter, user: { id: hunter.user.id, email: hunter.user.email, username: hunter.user.username } })
}

const allocateStats = async (req, res) => {
  const { stat, amount } = req.body
  const field = statFieldMap[stat]

  if (!field || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid stat allocation request' })
  }

  const hunter = await prisma.hunter.findUnique({ where: { userId: req.user.userId } })
  if (!hunter) {
    return res.status(404).json({ error: 'Hunter profile not found' })
  }

  if (hunter.statPointsAvailable < amount) {
    return res.status(400).json({ error: 'Not enough available stat points' })
  }

  const updated = await prisma.hunter.update({
    where: { id: hunter.id },
    data: {
      [field]: { increment: amount },
      statPointsAvailable: { decrement: amount },
    },
  })

  res.json({ hunter: updated })
}

const leaderboard = async (req, res) => {
  const topHunters = await prisma.hunter.findMany({
    orderBy: [
      { level: 'desc' },
      { xp: 'desc' },
      { coins: 'desc' },
    ],
    take: 10,
    include: { user: true },
  })

  const leaderboardData = topHunters.map((hunter) => ({
    id: hunter.id,
    username: hunter.user.username,
    level: hunter.level,
    rank: hunter.rank,
    coins: hunter.coins,
  }))

  res.json({ leaderboard: leaderboardData })
}

export { getStatus, allocateStats, leaderboard }
