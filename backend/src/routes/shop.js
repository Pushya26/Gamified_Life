import express from 'express'
import { body, param } from 'express-validator'
import { listItems, createItem, buyItem } from '../controllers/shopController.js'
import authenticate from '../middleware/auth.js'
import asyncHandler from '../utils/asyncHandler.js'
import validateRequest from '../middleware/validateRequest.js'

const router = express.Router()
router.use(authenticate)

const createItemValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('costCoins').isInt({ min: 0 }).withMessage('costCoins must be a non-negative integer'),
  validateRequest,
]

const shopItemIdParam = [param('id').trim().notEmpty().withMessage('Shop item id is required'), validateRequest]

router.get('/', asyncHandler(listItems))
router.post('/', createItemValidators, asyncHandler(createItem))
router.post('/:id/buy', shopItemIdParam, asyncHandler(buyItem))

export default router
