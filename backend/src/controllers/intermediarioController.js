// backend/src/controllers/intermediarioController.js
const Intermediario = require('../models/intermediarioModel');
const User = require('../models/userModel');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { generateAuthToken } = require('../utils/tokenUtils');

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
 * TODOS os produtos publicados com status de solicitação do intermediário
 * GET /api/intermediario/todos-produtos
 */
exports.getTodosProdutosComStatus = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const produtos = await Intermediario.getTodosProdutosComStatus(intermediarioId);
        res.status(200).json(produtos);
    } catch (error) {
        console.error('Erro em getTodosProdutosComStatus:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos.' });
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
 * Produtos activos do intermediário
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
 * Vendas activas do intermediário
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
 * Histórico de ganhos
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
 * Solicitar intermediação de um produto
 * POST /api/intermediario/solicitar/:produtoId
 */
exports.solicitarIntermediacao = async (req, res) => {
    let responseSent = false;
    
    const sendResponse = (status, data) => {
        if (!responseSent) {
            responseSent = true;
            return res.status(status).json(data);
        }
    };
    
    try {
        if (!req.user) {
            return sendResponse(401, { 
                success: false,
                message: 'Token inválido'
            });
        }
        
        const intermediarioId = req.user.id;
        const { produtoId } = req.params;
        
        if (!intermediarioId || !produtoId) {
            return sendResponse(400, {
                success: false,
                message: 'IDs obrigatórios'
            });
        }
        
        const resultado = await Intermediario.criarSolicitacao(intermediarioId, produtoId);
        
        if (resultado.error) {
            return sendResponse(500, {
                success: false,
                message: resultado.message
            });
        }
        
        if (resultado.produtoIndisponivel) {
            return sendResponse(400, {
                success: false,
                message: resultado.message
            });
        }
        
        if (resultado.jaExiste) {
            return sendResponse(409, {
                success: false,
                message: `Já existe solicitação ${resultado.status} para este produto`
            });
        }
        
        if (resultado.sucesso) {
            return sendResponse(201, {
                success: true,
                message: 'Solicitação de intermediação criada com sucesso!',
                data: {
                    solicitacao_id: resultado.id,
                    produto_id: parseInt(produtoId),
                    status: 'pendente'
                }
            });
        }
        
        return sendResponse(500, {
            success: false,
            message: 'Erro desconhecido ao criar solicitação'
        });
        
    } catch (error) {
        console.error('Erro em solicitarIntermediacao:', error);
        return sendResponse(500, {
            success: false,
            message: 'Erro interno no servidor'
        });
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
 * Listar todos os intermediários disponíveis
 * GET /api/intermediario/listar
 */
exports.listarIntermediarios = async (req, res) => {
    try {
        const [intermediarios] = await db.execute(
            `SELECT 
                id, 
                nome, 
                email, 
                telefone,
                localizacao,
                tipo_usuario,
                status,
                data_criacao
             FROM usuarios 
             WHERE tipo_usuario = 'intermediario' 
             AND status = 'ativo'
             ORDER BY nome ASC`
        );

        const formatados = intermediarios.map(inter => ({
            id: inter.id,
            nome: inter.nome,
            email: inter.email || '',
            tipo_usuario: inter.tipo_usuario,
            status: inter.status,
            data_criacao: inter.data_criacao,
            telefone: inter.telefone || 'Não informado',
            localizacao: inter.localizacao || 'Não informada'
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

// ============================================
// ========== MÉTODOS DE PERFIL ==========
// ============================================

/**
 * Buscar perfil do intermediário logado
 * GET /api/intermediario/perfil
 */
exports.getPerfil = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [rows] = await db.execute(
            `SELECT 
                id, 
                nome, 
                email, 
                telefone,
                localizacao,
                status,
                tipo_usuario,
                foto_perfil,
                data_criacao
             FROM usuarios 
             WHERE id = ? AND tipo_usuario = 'intermediario'`,
            [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                error: true, 
                message: 'Perfil não encontrado' 
            });
        }
        
        const usuario = rows[0];
        
        let fotoBase64 = null;
        if (usuario.foto_perfil) {
            const buffer = Buffer.isBuffer(usuario.foto_perfil) 
                ? usuario.foto_perfil 
                : Buffer.from(usuario.foto_perfil);
            fotoBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        }
        
        res.status(200).json({
            success: true,
            data: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone || '',
                localizacao: usuario.localizacao || '',
                foto_perfil: fotoBase64,
                data_criacao: usuario.data_criacao,
                status: usuario.status,
                tipo_usuario: usuario.tipo_usuario
            }
        });
        
    } catch (error) {
        console.error('Erro em getPerfil:', error);
        res.status(500).json({ 
            error: true, 
            message: 'Erro ao buscar perfil' 
        });
    }
};

/**
 * Atualizar perfil do intermediário (nome, email, telefone, localizacao)
 * PUT /api/intermediario/perfil
 */
exports.updatePerfil = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nome, email, telefone, localizacao } = req.body;
        
        console.log('Recebendo atualização:', { userId, nome, email, telefone, localizacao });
        
        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                error: true,
                message: 'O nome é obrigatório'
            });
        }
        
        if (!email || email.trim() === '') {
            return res.status(400).json({
                error: true,
                message: 'O email é obrigatório'
            });
        }
        
        // Verificar se o email já existe para outro usuário
        const [existingUser] = await db.execute(
            'SELECT id FROM usuarios WHERE email = ? AND id != ?',
            [email.trim(), userId]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Este email já está em uso por outro usuário'
            });
        }
        
        const updates = [];
        const values = [];
        
        updates.push('nome = ?');
        values.push(nome.trim());
        
        updates.push('email = ?');
        values.push(email.trim());
        
        if (telefone !== undefined) {
            updates.push('telefone = ?');
            values.push(telefone || null);
        }
        
        if (localizacao !== undefined) {
            updates.push('localizacao = ?');
            values.push(localizacao || null);
        }
        
        values.push(userId);
        
        const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ? AND tipo_usuario = 'intermediario'`;
        
        const [result] = await db.execute(query, values);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: true,
                message: 'Perfil não encontrado'
            });
        }
        
        const [updatedRows] = await db.execute(
            `SELECT id, nome, email, telefone, localizacao, foto_perfil, data_criacao, status, tipo_usuario
             FROM usuarios WHERE id = ?`,
            [userId]
        );
        
        const usuario = updatedRows[0];
        let fotoBase64 = null;
        if (usuario.foto_perfil) {
            const buffer = Buffer.isBuffer(usuario.foto_perfil) 
                ? usuario.foto_perfil 
                : Buffer.from(usuario.foto_perfil);
            fotoBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        }
        
        res.status(200).json({
            success: true,
            message: 'Perfil atualizado com sucesso',
            data: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                localizacao: usuario.localizacao,
                foto_perfil: fotoBase64,
                data_criacao: usuario.data_criacao,
                status: usuario.status,
                tipo_usuario: usuario.tipo_usuario
            }
        });
        
    } catch (error) {
        console.error('Erro em updatePerfil:', error);
        res.status(500).json({ 
            error: true, 
            message: 'Erro ao atualizar perfil: ' + error.message
        });
    }
};

/**
 * Atualizar foto do perfil
 * PUT /api/intermediario/perfil/foto
 */
exports.updateFotoPerfil = async (req, res) => {
    try {
        const userId = req.user.id;
        const { foto_base64 } = req.body;
        
        if (!foto_base64) {
            return res.status(400).json({
                error: true,
                message: 'Foto não fornecida'
            });
        }
        
        let base64Data = foto_base64;
        if (foto_base64.includes(',')) {
            base64Data = foto_base64.split(',')[1];
        }
        
        const fotoBuffer = Buffer.from(base64Data, 'base64');
        
        const [result] = await db.execute(
            `UPDATE usuarios SET foto_perfil = ? WHERE id = ? AND tipo_usuario = 'intermediario'`,
            [fotoBuffer, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: true,
                message: 'Perfil não encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Foto atualizada com sucesso'
        });
        
    } catch (error) {
        console.error('Erro em updateFotoPerfil:', error);
        res.status(500).json({ 
            error: true, 
            message: 'Erro ao atualizar foto' 
        });
    }
};

/**
 * Mudar senha do intermediário
 * PUT /api/intermediario/alterar-senha
 */
exports.alterarSenha = async (req, res) => {
    try {
        const userId = req.user.id;
        const { senha_antiga, nova_senha, confirmar_senha } = req.body;
        
        // Validações
        if (!senha_antiga || !nova_senha || !confirmar_senha) {
            return res.status(400).json({
                error: true,
                message: 'Todos os campos de senha são obrigatórios'
            });
        }
        
        if (nova_senha.length < 6) {
            return res.status(400).json({
                error: true,
                message: 'A nova senha deve ter pelo menos 6 caracteres'
            });
        }
        
        if (nova_senha !== confirmar_senha) {
            return res.status(400).json({
                error: true,
                message: 'A nova senha e a confirmação não coincidem'
            });
        }
        
        // Buscar usuário com a senha atual
        const [rows] = await db.execute(
            'SELECT senha FROM usuarios WHERE id = ? AND tipo_usuario = "intermediario"',
            [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'Usuário não encontrado'
            });
        }
        
        // Verificar senha antiga
        const senhaValida = await bcrypt.compare(senha_antiga, rows[0].senha);
        
        if (!senhaValida) {
            return res.status(401).json({
                error: true,
                message: 'Senha antiga incorreta'
            });
        }
        
        // Hash da nova senha
        const novaSenhaHash = await bcrypt.hash(nova_senha, 10);
        
        // Atualizar senha
        const [result] = await db.execute(
            'UPDATE usuarios SET senha = ? WHERE id = ?',
            [novaSenhaHash, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(500).json({
                error: true,
                message: 'Erro ao atualizar senha'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Senha alterada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro em alterarSenha:', error);
        res.status(500).json({
            error: true,
            message: 'Erro ao alterar senha: ' + error.message
        });
    }
};