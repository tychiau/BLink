const Intermediario = require('../models/intermediarioModel');
const User = require('../models/userModel'); // Adicione esta linha

/**
 * Estatísticas gerais do intermediário (dashboard principal)
 * GET /api/intermediario/stats
 */
exports.getStats = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const stats = await Intermediario.getStats(intermediarioId);
        res.status(200).json(stats);
    } catch (error) {
        console.error('Erro em getStats (intermediario):', error);
        res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
    }
};

/**
 * Oportunidades de venda — produtos publicados disponíveis para vinculação
 * GET /api/intermediario/oportunidades
 */
exports.getOportunidades = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const produtos = await Intermediario.getProdutosDisponiveis(intermediarioId);
        res.status(200).json(produtos);
    } catch (error) {
        console.error('Erro em getOportunidades:', error);
        res.status(500).json({ message: 'Erro ao buscar oportunidades de venda.' });
    }
};

/**
 * Novos produtos — publicados nos últimos 30 dias
 * GET /api/intermediario/novos-produtos
 */
exports.getNovoProdutos = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const produtos = await Intermediario.getNovoProdutos(intermediarioId);
        res.status(200).json(produtos);
    } catch (error) {
        console.error('Erro em getNovoProdutos:', error);
        res.status(500).json({ message: 'Erro ao buscar novos produtos.' });
    }
};

/**
 * Produtos activos do intermediário (vinculados e aceites)
 * GET /api/intermediario/produtos-ativos
 */
exports.getProdutosAtivos = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const produtos = await Intermediario.getProdutosAtivos(intermediarioId);
        res.status(200).json(produtos);
    } catch (error) {
        console.error('Erro em getProdutosAtivos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos ativos.' });
    }
};

/**
 * Aprovações pendentes — solicitações aguardando resposta
 * GET /api/intermediario/aprovacoes-pendentes
 */
exports.getAprovacoesPendentes = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const aprovacoes = await Intermediario.getAprovacoesPendentes(intermediarioId);
        res.status(200).json(aprovacoes);
    } catch (error) {
        console.error('Erro em getAprovacoesPendentes:', error);
        res.status(500).json({ message: 'Erro ao buscar aprovações pendentes.' });
    }
};

/**
 * Vendas activas do intermediário (status = retido)
 * GET /api/intermediario/vendas-ativas
 */
exports.getVendasAtivas = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const vendas = await Intermediario.getVendasAtivas(intermediarioId);
        res.status(200).json(vendas);
    } catch (error) {
        console.error('Erro em getVendasAtivas:', error);
        res.status(500).json({ message: 'Erro ao buscar vendas ativas.' });
    }
};

/**
 * Histórico de ganhos — todas as vendas registadas
 * GET /api/intermediario/historico-ganhos
 */
exports.getHistoricoGanhos = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const historico = await Intermediario.getHistoricoGanhos(intermediarioId);
        res.status(200).json(historico);
    } catch (error) {
        console.error('Erro em getHistoricoGanhos:', error);
        res.status(500).json({ message: 'Erro ao buscar histórico de ganhos.' });
    }
};

/**
 * Comissão do mês actual
 * GET /api/intermediario/comissao-mensal
 */
exports.getComissaoMensal = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const comissao = await Intermediario.getComissaoMensal(intermediarioId);
        res.status(200).json(comissao);
    } catch (error) {
        console.error('Erro em getComissaoMensal:', error);
        res.status(500).json({ message: 'Erro ao calcular comissão mensal.' });
    }
};

/**
 * Solicitar intermediação de um produto (vincular ao perfil)
 * POST /api/intermediario/solicitar/:produtoId
 */
exports.solicitarIntermediacao = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const { produtoId } = req.params;

        if (!produtoId) {
            return res.status(400).json({ message: 'ID do produto é obrigatório.' });
        }

        const resultado = await Intermediario.criarSolicitacao(intermediarioId, produtoId);

        if (resultado.jaExiste) {
            return res.status(409).json({ message: 'Já existe uma solicitação ativa para este produto.' });
        }

        if (resultado.produtoIndisponivel) {
            return res.status(404).json({ message: 'Produto não encontrado ou não está disponível.' });
        }

        res.status(201).json({
            message: 'Solicitação de intermediação criada com sucesso!',
            solicitacao_id: resultado.id
        });
    } catch (error) {
        console.error('Erro em solicitarIntermediacao:', error);
        res.status(500).json({ message: 'Erro ao solicitar intermediação.' });
    }
};

/**
 * Cancelar uma solicitação pendente
 * DELETE /api/intermediario/solicitacao/:solicitacaoId
 */
exports.cancelarSolicitacao = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const { solicitacaoId } = req.params;

        const cancelado = await Intermediario.cancelarSolicitacao(intermediarioId, solicitacaoId);

        if (!cancelado) {
            return res.status(404).json({ message: 'Solicitação não encontrada ou já foi processada.' });
        }

        res.status(200).json({ message: 'Solicitação cancelada com sucesso.' });
    } catch (error) {
        console.error('Erro em cancelarSolicitacao:', error);
        res.status(500).json({ message: 'Erro ao cancelar solicitação.' });
    }
};

/**
 * Listar todos os intermediários disponíveis (para vendedores)
 * GET /api/intermediario/listar
 */
// backend/src/controllers/intermediarioController.js

/**
 * Listar todos os intermediários disponíveis (para vendedores)
 * GET /api/intermediario/listar
 */
exports.listarIntermediarios = async (req, res) => {
    try {
        const db = require('../config/db');
        
        const [intermediarios] = await db.execute(
            `SELECT 
                id, 
                nome, 
                email, 
                tipo_usuario,
                status,
                data_criacao
             FROM usuarios 
             WHERE tipo_usuario = 'intermediario' 
             AND status = 'ativo'
             ORDER BY nome ASC`
        );
        
        // Formatar os dados para o frontend
        const formatados = intermediarios.map(inter => ({
            id: inter.id,
            nome: inter.nome,
            email: inter.email || '',
            tipo_usuario: inter.tipo_usuario,
            status: inter.status,
            data_criacao: inter.data_criacao,
            telefone: 'N/A',
            avaliacao: 4.5,
            cidade: 'N/A'
        }));
        
        console.log(`Listando ${formatados.length} intermediários`);
        res.status(200).json(formatados);
    } catch (error) {
        console.error('Erro em listarIntermediarios:', error);
        res.status(500).json({ 
            error: true, 
            message: 'Erro ao buscar intermediários' 
        });
    }
};