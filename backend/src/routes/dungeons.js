import express from 'express'
import { body, param } from 'express-validator'
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
import asyncHandler from '../utils/asyncHandler.js'
import validateRequest from '../middleware/validateRequest.js'

const router = express.Router()
router.use(authenticate)

const dungeonIdParam = [param('id').trim().notEmpty().withMessage('Dungeon id is required'), validateRequest]

const createDungeonValidators = [
  body('title').trim().notEmpty().withMessage('Dungeon title is required'),
  body('description').optional().trim(),
  body('rank')
    .optional()
    .isIn(['E', 'D', 'C', 'B', 'A', 'S', 'NATIONAL'])
    .withMessage('Invalid rank'),
  body('deadline').optional().isISO8601().withMessage('Invalid deadline'),
  body('xpReward').optional().isInt({ min: 0 }).withMessage('xpReward must be a non-negative integer'),
  validateRequest,
]

const updateDungeonValidators = [
  param('id').trim().notEmpty().withMessage('Dungeon id is required'),
  body('title').optional().trim().notEmpty().withMessage('Dungeon title cannot be empty'),
  body('description').optional().trim(),
  body('rank')
    .optional()
    .isIn(['E', 'D', 'C', 'B', 'A', 'S', 'NATIONAL'])
    .withMessage('Invalid rank'),
  body('deadline').optional().isISO8601().withMessage('Invalid deadline'),
  body('xpReward').optional().isInt({ min: 0 }).withMessage('xpReward must be a non-negative integer'),
  validateRequest,
]

const addTaskValidators = [
  param('id').trim().notEmpty().withMessage('Dungeon id is required'),
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('orderIndex').optional().isInt({ min: 0 }).withMessage('orderIndex must be a non-negative integer'),
  validateRequest,
]

const taskCompleteValidators = [
  param('id').trim().notEmpty().withMessage('Dungeon id is required'),
  param('taskId').trim().notEmpty().withMessage('Task id is required'),
  validateRequest,
]

const clearDungeonValidators = [
  param('id').trim().notEmpty().withMessage('Dungeon id is required'),
  validateRequest,
]

router.get('/', asyncHandler(listDungeons))
router.post('/', createDungeonValidators, asyncHandler(createDungeon))
router.get('/:id', dungeonIdParam, asyncHandler(getDungeon))
router.put('/:id', updateDungeonValidators, asyncHandler(updateDungeon))
router.post('/:id/tasks', addTaskValidators, asyncHandler(addTask))
router.put('/:id/tasks/:taskId/complete', taskCompleteValidators, asyncHandler(completeTask))
router.post('/:id/clear', clearDungeonValidators, asyncHandler(clearDungeon))

export default router
