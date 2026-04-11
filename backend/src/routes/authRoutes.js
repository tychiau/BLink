const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { 
  validateRegister, 
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset
} = require('../middlewares/validationMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Registar novo utilizador
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login de utilizador
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/auth/request-password-reset
 * @desc    Solicitar reset de password
 * @access  Public
 */
router.post('/request-password-reset', validatePasswordResetRequest, authController.requestPasswordReset);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Redefinir password com token
 * @access  Public
 */
router.post('/reset-password', validatePasswordReset, authController.resetPassword);

/**
 * @route   GET /api/auth/profile
 * @desc    Obter dados do utilizador autenticado
 * @access  Private (requer autenticação)
 */
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
