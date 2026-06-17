import express from 'express'
import { body, param } from 'express-validator'
import { listShadows, createShadow, checkinShadow } from '../controllers/shadowController.js'
import authenticate from '../middleware/auth.js'
import asyncHandler from '../utils/asyncHandler.js'
import validateRequest from '../middleware/validateRequest.js'

const router = express.Router()
router.use(authenticate)

const createShadowValidators = [
  body('habitName').trim().notEmpty().withMessage('Habit name is required'),
  body('icon').optional().trim(),
  validateRequest,
]

const shadowIdParam = [param('id').trim().notEmpty().withMessage('Shadow id is required'), validateRequest]

router.get('/', asyncHandler(listShadows))
router.post('/', createShadowValidators, asyncHandler(createShadow))
router.post('/:id/checkin', shadowIdParam, asyncHandler(checkinShadow))

export default router
