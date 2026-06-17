import express from 'express'
import {
  listDungeons,
  createDungeon,
  getDungeon,
  updateDungeon,
  addTask,
  completeTask,
  clearDungeon,
} from '../controllers/dungeonController.js'
import authenticate from '../middleware/auth.js'

const router = express.Router()
router.use(authenticate)

router.get('/', listDungeons)
router.post('/', createDungeon)
router.get('/:id', getDungeon)
router.put('/:id', updateDungeon)
router.post('/:id/tasks', addTask)
router.put('/:id/tasks/:taskId/complete', completeTask)
router.post('/:id/clear', clearDungeon)

export default router
