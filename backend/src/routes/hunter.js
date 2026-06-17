import express from 'express'
import { body } from 'express-validator'
import { getStatus, allocateStats, leaderboard } from '../controllers/hunterController.js'
import authenticate from '../middleware/auth.js'
import asyncHandler from '../utils/asyncHandler.js'
import validateRequest from '../middleware/validateRequest.js'

const router = express.Router()
router.use(authenticate)

const allocateStatsValidators = [
  body('stat')
    .trim()
    .isIn(['STR', 'AGI', 'INT', 'VIT', 'SENSE'])
    .withMessage('Invalid stat'),
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer'),
  validateRequest,
]

router.get('/status', asyncHandler(getStatus))
router.put('/allocate-stats', allocateStatsValidators, asyncHandler(allocateStats))
router.get('/leaderboard', asyncHandler(leaderboard))

export default router
