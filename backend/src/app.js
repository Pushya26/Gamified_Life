import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import hunterRoutes from './routes/hunter.js'
import questsRoutes from './routes/quests.js'
import dungeonsRoutes from './routes/dungeons.js'
import shadowsRoutes from './routes/shadows.js'
import shopRoutes from './routes/shop.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/hunter', hunterRoutes)
app.use('/api/quests', questsRoutes)
app.use('/api/dungeons', dungeonsRoutes)
app.use('/api/shadows', shadowsRoutes)
app.use('/api/shop', shopRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
