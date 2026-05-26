// backend/src/routes/intermediarioRoutes.js
const express = require('express');
const router = express.Router();
const intermediarioController = require('../controllers/intermediarioController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

console.log("\n=== CARREGANDO INTERMEDIARIO ROUTES ===");

const auth = [authenticateToken, authorizeRole('intermediario', 'admin')];

// ============================================
// ROTA DE TESTE
// ============================================
router.get('/teste', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Rotas de intermediário estão funcionando!',
        endpoints: ['/perfil', '/stats', '/oportunidades', '/listar', '/alterar-senha']
    });
});

// ============================================
// ROTAS DE PERFIL
// ============================================
router.get('/perfil', auth, intermediarioController.getPerfil);
router.put('/perfil', auth, intermediarioController.updatePerfil);
router.put('/perfil/foto', auth, intermediarioController.updateFotoPerfil);
router.put('/alterar-senha', auth, intermediarioController.alterarSenha);

// ============================================
// ROTAS DO DASHBOARD
// ============================================
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

// ============================================
// ROTA PÚBLICA
// ============================================
router.get('/listar', intermediarioController.listarIntermediarios);

module.exports = router;
