import express from 'express'
import { body, query, param } from 'express-validator'
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
import asyncHandler from '../utils/asyncHandler.js'
import validateRequest from '../middleware/validateRequest.js'

const router = express.Router()
router.use(authenticate)

const questIdParam = [param('id').trim().notEmpty().withMessage('Quest id is required'), validateRequest]

const createQuestValidators = [
  body('title').trim().notEmpty().withMessage('Quest title is required'),
  body('description').optional().trim(),
  body('difficulty')
    .optional()
    .isIn(['E', 'D', 'C', 'B', 'A', 'S'])
    .withMessage('Invalid difficulty'),
  body('status')
    .optional()
    .isIn(['pending', 'active', 'completed', 'failed'])
    .withMessage('Invalid status'),
  body('xpReward').optional().isInt({ min: 0 }).withMessage('xpReward must be a non-negative integer'),
  body('coinReward').optional().isInt({ min: 0 }).withMessage('coinReward must be a non-negative integer'),
  body('statType')
    .optional()
    .isIn(['STR', 'AGI', 'INT', 'VIT', 'SENSE'])
    .withMessage('Invalid statType'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('isDaily').optional().isBoolean().withMessage('Invalid isDaily value').toBoolean(),
  body('recurrence')
    .optional()
    .isIn(['none', 'daily', 'weekly'])
    .withMessage('Invalid recurrence'),
  validateRequest,
]

const updateQuestValidators = [
  param('id').trim().notEmpty().withMessage('Quest id is required'),
  body('title').optional().trim().notEmpty().withMessage('Quest title cannot be empty'),
  body('description').optional().trim(),
  body('difficulty')
    .optional()
    .isIn(['E', 'D', 'C', 'B', 'A', 'S'])
    .withMessage('Invalid difficulty'),
  body('status')
    .optional()
    .isIn(['pending', 'active', 'completed', 'failed'])
    .withMessage('Invalid status'),
  body('xpReward').optional().isInt({ min: 0 }).withMessage('xpReward must be a non-negative integer'),
  body('coinReward').optional().isInt({ min: 0 }).withMessage('coinReward must be a non-negative integer'),
  body('statType')
    .optional()
    .isIn(['STR', 'AGI', 'INT', 'VIT', 'SENSE'])
    .withMessage('Invalid statType'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('isDaily').optional().isBoolean().withMessage('Invalid isDaily value').toBoolean(),
  body('recurrence')
    .optional()
    .isIn(['none', 'daily', 'weekly'])
    .withMessage('Invalid recurrence'),
  validateRequest,
]

router.get(
  '/',
  [
    query('status').optional().isIn(['pending', 'active', 'completed', 'failed']).withMessage('Invalid status filter'),
    query('difficulty').optional().isIn(['E', 'D', 'C', 'B', 'A', 'S']).withMessage('Invalid difficulty filter'),
    query('date').optional().isISO8601().withMessage('Invalid date filter'),
    validateRequest,
  ],
  asyncHandler(listQuests),
)
router.post('/', createQuestValidators, asyncHandler(createQuest))
router.put('/:id', updateQuestValidators, asyncHandler(updateQuest))
router.delete('/:id', questIdParam, asyncHandler(deleteQuest))
router.post('/:id/complete', questIdParam, asyncHandler(completeQuest))
router.post('/:id/fail', questIdParam, asyncHandler(failQuest))
router.get('/daily', asyncHandler(getDailyQuests))
router.post('/generate-daily', asyncHandler(generateDailyQuests))

export default router
