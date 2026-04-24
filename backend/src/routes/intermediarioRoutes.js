const express = require('express');
const router = express.Router();
const intermediarioController = require('../controllers/intermediarioController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação e perfil de intermediário
const auth = [authenticateToken, authorizeRole('intermediario', 'admin')];

/**
 * @route   GET /api/intermediario/stats
 * @desc    Estatísticas gerais do dashboard do intermediário
 * @access  Private (intermediario, admin)
 */
router.get('/stats', auth, intermediarioController.getStats);

/**
 * @route   GET /api/intermediario/oportunidades
 * @desc    Produtos publicados disponíveis para intermediação
 * @access  Private (intermediario, admin)
 */
router.get('/oportunidades', auth, intermediarioController.getOportunidades);

/**
 * @route   GET /api/intermediario/novos-produtos
 * @desc    Produtos novos (últimos 30 dias) disponíveis
 * @access  Private (intermediario, admin)
 */
router.get('/novos-produtos', auth, intermediarioController.getNovoProdutos);

/**
 * @route   GET /api/intermediario/produtos-ativos
 * @desc    Produtos activos do intermediário (vinculados/aceites)
 * @access  Private (intermediario, admin)
 */
router.get('/produtos-ativos', auth, intermediarioController.getProdutosAtivos);

/**
 * @route   GET /api/intermediario/aprovacoes-pendentes
 * @desc    Solicitações de intermediação pendentes
 * @access  Private (intermediario, admin)
 */
router.get('/aprovacoes-pendentes', auth, intermediarioController.getAprovacoesPendentes);

/**
 * @route   GET /api/intermediario/vendas-ativas
 * @desc    Vendas em curso do intermediário (status retido)
 * @access  Private (intermediario, admin)
 */
router.get('/vendas-ativas', auth, intermediarioController.getVendasAtivas);

/**
 * @route   GET /api/intermediario/historico-ganhos
 * @desc    Histórico completo de ganhos
 * @access  Private (intermediario, admin)
 */
router.get('/historico-ganhos', auth, intermediarioController.getHistoricoGanhos);

/**
 * @route   GET /api/intermediario/comissao-mensal
 * @desc    Comissão do mês actual
 * @access  Private (intermediario, admin)
 */
router.get('/comissao-mensal', auth, intermediarioController.getComissaoMensal);

/**
 * @route   POST /api/intermediario/solicitar/:produtoId
 * @desc    Solicitar intermediação de um produto
 * @access  Private (intermediario, admin)
 */
router.post('/solicitar/:produtoId', auth, intermediarioController.solicitarIntermediacao);

/**
 * @route   DELETE /api/intermediario/solicitacao/:solicitacaoId
 * @desc    Cancelar uma solicitação pendente
 * @access  Private (intermediario, admin)
 */
router.delete('/solicitacao/:solicitacaoId', auth, intermediarioController.cancelarSolicitacao);

module.exports = router;
