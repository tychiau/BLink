const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

/**
 * Exemplos de rotas protegidas por autenticação e autorização
 */

/**
 * @route   GET /api/protected/dashboard
 * @desc    Rota acessível por qualquer utilizador autenticado
 * @access  Private
 */
router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'Bem-vindo ao dashboard!',
    user: req.user
  });
});

/**
 * @route   GET /api/protected/cliente-area
 * @desc    Rota acessível apenas por CLIENTES
 * @access  Private (apenas clientes)
 */
router.get('/cliente-area', authenticateToken, authorizeRole('cliente'), (req, res) => {
  res.json({
    message: 'Área exclusiva de clientes',
    user: req.user
  });
});

/**
 * @route   GET /api/protected/intermediario-area
 * @desc    Rota acessível apenas por INTERMEDIÁRIOS
 * @access  Private (apenas intermediarios)
 */
router.get('/intermediario-area', authenticateToken, authorizeRole('intermediario'), (req, res) => {
  res.json({
    message: 'Área exclusiva de intermediários',
    user: req.user
  });
});

/**
 * @route   GET /api/protected/vendedor-area
 * @desc    Rota acessível apenas por VENDEDORES
 * @access  Private (apenas vendedores)
 */
router.get('/vendedor-area', authenticateToken, authorizeRole('vendedor'), (req, res) => {
  res.json({
    message: 'Área exclusiva de vendedores',
    user: req.user
  });
});

/**
 * @route   GET /api/protected/admin-area
 * @desc    Rota acessível por INTERMEDIÁRIOS e VENDEDORES
 * @access  Private (intermediarios ou vendedores)
 */
router.get('/admin-area', authenticateToken, authorizeRole('intermediario', 'vendedor'), (req, res) => {
  res.json({
    message: 'Área para intermediários e vendedores',
    user: req.user
  });
});

module.exports = router;
