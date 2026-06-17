import express from 'express'
import { listShadows, createShadow, checkinShadow } from '../controllers/shadowController.js'
import authenticate from '../middleware/auth.js'

const router = express.Router()
router.use(authenticate)

router.get('/', listShadows)
router.post('/', createShadow)
router.post('/:id/checkin', checkinShadow)

export default router
