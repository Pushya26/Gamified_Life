import prisma from '../prisma.js'

const getHunter = async (userId) => prisma.hunter.findUnique({ where: { userId } })

const listShadows = async (req, res) => {
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const shadows = await prisma.shadow.findMany({ where: { hunterId: hunter.id }, orderBy: { createdAt: 'desc' } })
  res.json({ shadows })
}

const createShadow = async (req, res) => {
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const { habitName, icon } = req.body
  if (!habitName) {
    return res.status(400).json({ error: 'Habit name is required' })
  }

  const shadow = await prisma.shadow.create({
    data: {
      hunterId: hunter.id,
      habitName,
      icon,
    },
  })

  res.status(201).json({ shadow })
}

const checkinShadow = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const shadow = await prisma.shadow.findUnique({ where: { id } })
  if (!shadow || shadow.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Shadow not found' })
  }

  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const lastChecked = shadow.lastChecked ? shadow.lastChecked.toISOString().slice(0, 10) : null

  if (lastChecked === today) {
    return res.status(400).json({ error: 'Shadow already checked in today' })
  }

  let streakCount = 1
  if (lastChecked) {
    const previous = new Date(shadow.lastChecked)
    const tomorrow = new Date(previous)
    tomorrow.setDate(previous.getDate() + 1)
    if (tomorrow.toISOString().slice(0, 10) === today) {
      streakCount = shadow.streakCount + 1
    }
  }

  const isAwakened = streakCount >= 7

  const updated = await prisma.shadow.update({
    where: { id },
    data: {
      streakCount,
      lastChecked: now,
      isAwakened,
    },
  })

  res.json({ shadow: updated })
}

export { listShadows, createShadow, checkinShadow }
