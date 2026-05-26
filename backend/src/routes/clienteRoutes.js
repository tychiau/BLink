// backend/src/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const auth = [authenticateToken, authorizeRole('cliente', 'admin')];

// Rotas do cliente
router.post('/solicitar-compra', auth, clienteController.solicitarCompra);
router.get('/minhas-solicitacoes', auth, clienteController.minhasSolicitacoes);
router.delete('/cancelar-solicitacao/:solicitacaoId', auth, clienteController.cancelarSolicitacao);

module.exports = router;
