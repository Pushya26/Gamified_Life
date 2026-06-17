import express from 'express'
import { listItems, createItem, buyItem } from '../controllers/shopController.js'
import authenticate from '../middleware/auth.js'

const router = express.Router()
router.use(authenticate)

router.get('/', listItems)
router.post('/', createItem)
router.post('/:id/buy', buyItem)

export default router
