import prisma from '../prisma.js'

const getHunter = async (userId) => prisma.hunter.findUnique({ where: { userId } })

const listItems = async (req, res) => {
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const items = await prisma.shopItem.findMany({ where: { hunterId: hunter.id }, orderBy: { createdAt: 'desc' } })
  res.json({ items })
}

const createItem = async (req, res) => {
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const { title, description, costCoins } = req.body
  if (!title || typeof costCoins !== 'number') {
    return res.status(400).json({ error: 'Title and cost are required' })
  }

  const item = await prisma.shopItem.create({
    data: {
      hunterId: hunter.id,
      title,
      description,
      costCoins,
    },
  })

  res.status(201).json({ item })
}

const buyItem = async (req, res) => {
  const { id } = req.params
  const hunter = await getHunter(req.user.userId)
  if (!hunter) return res.status(404).json({ error: 'Hunter not found' })

  const item = await prisma.shopItem.findUnique({ where: { id } })
  if (!item || item.hunterId !== hunter.id) {
    return res.status(404).json({ error: 'Shop item not found' })
  }

  if (item.isPurchased) {
    return res.status(400).json({ error: 'Item already purchased' })
  }

  if (hunter.coins < item.costCoins) {
    return res.status(400).json({ error: 'Insufficient coins' })
  }

  const [updatedItem, updatedHunter] = await prisma.$transaction([
    prisma.shopItem.update({
      where: { id },
      data: { isPurchased: true, purchasedAt: new Date() },
    }),
    prisma.hunter.update({
      where: { id: hunter.id },
      data: { coins: hunter.coins - item.costCoins },
    }),
  ])

  res.json({ item: updatedItem, hunter: updatedHunter })
}

export { listItems, createItem, buyItem }
