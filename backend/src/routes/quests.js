import express from 'express'
import {
  listQuests,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
  failQuest,
  getDailyQuests,
  generateDailyQuests,
} from '../controllers/questController.js'
import authenticate from '../middleware/auth.js'

const router = express.Router()
router.use(authenticate)

router.get('/', listQuests)
router.post('/', createQuest)
router.put('/:id', updateQuest)
router.delete('/:id', deleteQuest)
router.post('/:id/complete', completeQuest)
router.post('/:id/fail', failQuest)
router.get('/daily', getDailyQuests)
router.post('/generate-daily', generateDailyQuests)

export default router
