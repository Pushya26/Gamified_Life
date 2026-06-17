import express from 'express'
import { getStatus, allocateStats, leaderboard } from '../controllers/hunterController.js'
import authenticate from '../middleware/auth.js'

const router = express.Router()
router.use(authenticate)

router.get('/status', getStatus)
router.put('/allocate-stats', allocateStats)
router.get('/leaderboard', leaderboard)

export default router
