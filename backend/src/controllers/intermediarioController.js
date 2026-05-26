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
// backend/src/controllers/intermediarioController.js

// ============================================
// ========== MÉTODOS DE SOLICITAÇÕES DE COMPRA ==========
// ============================================

/**
 * Intermediário busca solicitações de compra pendentes
 * (solicitações que estão na tabela vendas com status_venda = 'retido'? Não, as pendentes são as que o cliente solicitou mas ainda não têm venda)
 * 
 * Na verdade, quando o cliente solicita uma compra, deve-se criar um registro na tabela vendas
 * com status_venda = 'retido' (aguardando aprovação do intermediário)
 * GET /api/intermediario/solicitacoes-compra
 */
exports.getSolicitacoesCompra = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        
        const [rows] = await db.execute(
            `SELECT 
                v.id,
                v.produto_id,
                v.valor_final,
                v.status_venda,
                v.data_venda,
                p.nome as produto_nome,
                p.foto_produto,
                u.nome as cliente_nome,
                u.email as cliente_email,
                u.telefone as cliente_telefone
             FROM vendas v
             INNER JOIN produtos p ON v.produto_id = p.id
             INNER JOIN usuarios u ON v.cliente_id = u.id
             WHERE v.intermediario_id = ? AND v.status_venda = 'retido'
             ORDER BY v.data_venda DESC`,
            [intermediarioId]
        );
        
        const solicitacoes = rows.map(v => {
            let fotoProduto = null;
            if (v.foto_produto && Buffer.isBuffer(v.foto_produto)) {
                fotoProduto = `data:image/jpeg;base64,${v.foto_produto.toString('base64')}`;
            }
            
            return {
                id: v.id,
                produto_id: v.produto_id,
                produto_nome: v.produto_nome,
                cliente_id: v.cliente_id,
                cliente_nome: v.cliente_nome,
                cliente_email: v.cliente_email || '',
                cliente_telefone: v.cliente_telefone || '',
                valor: parseFloat(v.valor_final),
                foto_produto: fotoProduto || "https://placehold.co/60x60/1e3a5f/ffffff?text=P",
                data_solicitacao: v.data_venda,
                status: v.status_venda
            };
        });
        
        res.json(solicitacoes);
    } catch (error) {
        console.error('Erro ao buscar solicitações de compra:', error);
        res.status(500).json({ message: "Erro ao buscar solicitações" });
    }
};

/**
 * Intermediário aprova solicitação de compra
 * (mantém status_venda como 'retido' - já está correto, apenas registra a aprovação)
 * POST /api/intermediario/solicitacoes-compra/:solicitacaoId/aprovar
 */
exports.aprovarSolicitacaoCompra = async (req, res) => {
    const { solicitacaoId } = req.params;
    const intermediarioId = req.user.id;
    
    try {
        // Verificar se a solicitação existe e está com status 'retido'
        const [solicitacao] = await db.execute(
            `SELECT id, status_venda FROM vendas 
             WHERE id = ? AND intermediario_id = ? AND status_venda = 'retido'`,
            [solicitacaoId, intermediarioId]
        );
        
        if (solicitacao.length === 0) {
            return res.status(404).json({ message: "Solicitação não encontrada ou já processada" });
        }
        
        // Aprovado - status permanece 'retido' (aguardando pagamento/liquidação)
        // Podemos adicionar uma coluna 'aprovado_em' se necessário
        await db.execute(
            `UPDATE vendas SET data_aprovacao = NOW() WHERE id = ?`,
            [solicitacaoId]
        );
        
        console.log(`Solicitação ${solicitacaoId} aprovada pelo intermediário ${intermediarioId}`);
        res.json({ success: true, message: "Compra aprovada com sucesso! Aguardando liquidação." });
        
    } catch (error) {
        console.error('Erro ao aprovar:', error);
        res.status(500).json({ message: "Erro ao aprovar compra" });
    }
};

/**
 * Intermediário rejeita solicitação de compra
 * (altera status_venda para 'estornado')
 * POST /api/intermediario/solicitacoes-compra/:solicitacaoId/rejeitar
 */
exports.rejeitarSolicitacaoCompra = async (req, res) => {
    const { solicitacaoId } = req.params;
    const intermediarioId = req.user.id;
    
    try {
        // Verificar se a solicitação existe e está com status 'retido'
        const [solicitacao] = await db.execute(
            `SELECT id, status_venda FROM vendas 
             WHERE id = ? AND intermediario_id = ? AND status_venda = 'retido'`,
            [solicitacaoId, intermediarioId]
        );
        
        if (solicitacao.length === 0) {
            return res.status(404).json({ message: "Solicitação não encontrada" });
        }
        
        // Rejeitado - muda status para 'estornado'
        await db.execute(
            `UPDATE vendas SET status_venda = 'estornado' WHERE id = ?`,
            [solicitacaoId]
        );
        
        console.log(`✅ Solicitação ${solicitacaoId} rejeitada pelo intermediário ${intermediarioId}`);
        res.json({ success: true, message: "Compra rejeitada" });
        
    } catch (error) {
        console.error('Erro ao rejeitar:', error);
        res.status(500).json({ message: "Erro ao rejeitar compra" });
    }
};

/**
 * Intermediário liquida uma venda (após receber pagamento)
 * Altera status_venda de 'retido' para 'liquidado'
 * POST /api/intermediario/vendas/:vendaId/liquidar
 */
exports.liquidarVenda = async (req, res) => {
    const { vendaId } = req.params;
    const intermediarioId = req.user.id;
    
    try {
        const [venda] = await db.execute(
            `SELECT id, status_venda FROM vendas 
             WHERE id = ? AND intermediario_id = ? AND status_venda = 'retido'`,
            [vendaId, intermediarioId]
        );
        
        if (venda.length === 0) {
            return res.status(404).json({ message: "Venda não encontrada ou já liquidada" });
        }
        
        await db.execute(
            `UPDATE vendas SET status_venda = 'liquidado' WHERE id = ?`,
            [vendaId]
        );
        
        res.json({ success: true, message: "Venda liquidada com sucesso!" });
        
    } catch (error) {
        console.error('Erro ao liquidar venda:', error);
        res.status(500).json({ message: "Erro ao liquidar venda" });
    }
};

/**
 * Intermediário busca vendas (histórico)
 * GET /api/intermediario/vendas
 */
exports.getVendas = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        
        const [rows] = await db.execute(
            `SELECT 
                v.id,
                v.produto_id,
                v.valor_final,
                v.status_venda,
                v.data_venda,
                p.nome as produto_nome,
                p.foto_produto,
                u.nome as cliente_nome
             FROM vendas v
             INNER JOIN produtos p ON v.produto_id = p.id
             INNER JOIN usuarios u ON v.cliente_id = u.id
             WHERE v.intermediario_id = ?
             ORDER BY v.data_venda DESC`,
            [intermediarioId]
        );
        
        const vendas = rows.map(v => {
            let fotoProduto = null;
            if (v.foto_produto && Buffer.isBuffer(v.foto_produto)) {
                fotoProduto = `data:image/jpeg;base64,${v.foto_produto.toString('base64')}`;
            }
            
            return {
                id: v.id,
                produto_id: v.produto_id,
                produto_nome: v.produto_nome,
                cliente_nome: v.cliente_nome,
                valor: parseFloat(v.valor_final),
                status: v.status_venda,
                foto_produto: fotoProduto,
                data_venda: v.data_venda
            };
        });
        
        res.json(vendas);
    } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        res.status(500).json({ message: "Erro ao buscar vendas" });
    }
};

/**
 * Intermediário busca estatísticas de vendas
 * GET /api/intermediario/vendas/estatisticas
 */
exports.getVendasEstatisticas = async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        
        const [rows] = await db.execute(
            `SELECT 
                COUNT(*) as total_vendas,
                SUM(CASE WHEN status_venda = 'liquidado' THEN 1 ELSE 0 END) as vendas_liquidadas,
                SUM(CASE WHEN status_venda = 'retido' THEN 1 ELSE 0 END) as vendas_retidas,
                SUM(CASE WHEN status_venda = 'estornado' THEN 1 ELSE 0 END) as vendas_estornadas,
                COALESCE(SUM(valor_final), 0) as valor_total
             FROM vendas 
             WHERE intermediario_id = ?`,
            [intermediarioId]
        );
        
        res.json({
            total_vendas: rows[0].total_vendas || 0,
            vendas_liquidadas: rows[0].vendas_liquidadas || 0,
            vendas_retidas: rows[0].vendas_retidas || 0,
            vendas_estornadas: rows[0].vendas_estornadas || 0,
            valor_total: parseFloat(rows[0].valor_total || 0)
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas de vendas:', error);
        res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
};