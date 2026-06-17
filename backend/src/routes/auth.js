import express from 'express'
import { body } from 'express-validator'
import { register, login, me } from '../controllers/authController.js'
import authenticate from '../middleware/auth.js'
import asyncHandler from '../utils/asyncHandler.js'
import validateRequest from '../middleware/validateRequest.js'

const router = express.Router()

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('username').trim().notEmpty().withMessage('Username is required'),
    validateRequest,
  ],
  asyncHandler(register),
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest,
  ],
  asyncHandler(login),
)

router.get('/me', authenticate, asyncHandler(me))

export default router
