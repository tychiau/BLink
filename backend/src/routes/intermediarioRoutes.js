// backend/src/routes/intermediarioRoutes.js

const express = require('express');
const router = express.Router();
const intermediarioController = require('../controllers/intermediarioController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação e perfil de intermediário
const auth = [authenticateToken, authorizeRole('intermediario', 'admin')];

// Rotas do dashboard do intermediário
router.get('/stats', auth, intermediarioController.getStats);
router.get('/oportunidades', auth, intermediarioController.getOportunidades);
router.get('/novos-produtos', auth, intermediarioController.getNovoProdutos);
router.get('/produtos-ativos', auth, intermediarioController.getProdutosAtivos);
router.get('/aprovacoes-pendentes', auth, intermediarioController.getAprovacoesPendentes);
router.get('/vendas-ativas', auth, intermediarioController.getVendasAtivas);
router.get('/historico-ganhos', auth, intermediarioController.getHistoricoGanhos);
router.get('/comissao-mensal', auth, intermediarioController.getComissaoMensal);
router.post('/solicitar/:produtoId', auth, intermediarioController.solicitarIntermediacao);
router.delete('/solicitacao/:solicitacaoId', auth, intermediarioController.cancelarSolicitacao);

// ROTA SEM AUTENTICAÇÃO para listar intermediários (para vendedores)
router.get('/listar', intermediarioController.listarIntermediarios);

module.exports = router;