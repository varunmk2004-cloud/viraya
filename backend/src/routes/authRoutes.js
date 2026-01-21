import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getMe
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateChangePassword
} from '../middleware/validation.js';
import {
  authLimiter,
  passwordResetLimiter
} from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/request-password-reset', passwordResetLimiter, validatePasswordResetRequest, requestPasswordReset);
router.post('/reset-password', passwordResetLimiter, validatePasswordReset, resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.post('/change-password', protect, validateChangePassword, changePassword);
router.get('/me', protect, getMe);

export default router;
