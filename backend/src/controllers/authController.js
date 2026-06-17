import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma.js'

const register = async (req, res) => {
  const { email, password, username } = req.body

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, username, and password are required' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return res.status(409).json({ error: 'Email already in use' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      hunter: {
        create: {
          name: username,
          xpToNextLevel: 100,
          rank: 'E',
        },
      },
    },
    include: { hunter: true },
  })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, username: user.username },
    hunter: user.hunter,
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = await prisma.user.findUnique({ where: { email }, include: { hunter: true } })
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email, username: user.username }, hunter: user.hunter })
}

const me = async (req, res) => {
  const userId = req.user?.userId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { hunter: true },
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({ user: { id: user.id, email: user.email, username: user.username }, hunter: user.hunter })
}

export { register, login, me }
