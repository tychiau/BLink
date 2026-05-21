// backend/src/controllers/vendedorController.js

const db = require('../config/db');

// Buscar solicitações recebidas (agora usando vendedor_id diretamente)
// backend/src/controllers/vendedorController.js

// Buscar solicitações recebidas

exports.getSolicitacoesRecebidas = async (req, res) => {
    try {
        const vendedorId = req.user.id;
        
        console.log("=== getSolicitacoesRecebidas ===");
        console.log("Vendedor ID:", vendedorId);
        
        const query = `
            SELECT 
                si.id,
                si.produto_id,
                si.intermediario_id,
                si.status,
                si.data_solicitacao,
                p.nome as produto_nome,
                p.preco_minimo,
                p.comissao_intermediario,
                p.foto_produto,
                u.nome as intermediario_nome,
                u.email as intermediario_email,
                u.foto_perfil as intermediario_foto
            FROM solicitacoes_intermediacao si
            INNER JOIN produtos p ON si.produto_id = p.id
            INNER JOIN usuarios u ON si.intermediario_id = u.id
            WHERE si.vendedor_id = ? AND si.status = 'pendente'
            ORDER BY si.data_solicitacao DESC
        `;
        
        const [solicitacoes] = await db.execute(query, [vendedorId]);
        
        console.log(`Encontradas ${solicitacoes.length} solicitações`);
        
        // Formatar as imagens (convertendo buffer para base64)
        const solicitacoesFormatadas = solicitacoes.map(s => {
            let fotoProduto = null;
            let fotoIntermediario = null;
            
            // Converter foto do produto (mediumblob) para base64
            if (s.foto_produto && Buffer.isBuffer(s.foto_produto) && s.foto_produto.length > 0) {
                fotoProduto = `data:image/jpeg;base64,${s.foto_produto.toString('base64')}`;
            }
            
            // Converter foto do intermediário (mediumblob) para base64
            if (s.intermediario_foto && Buffer.isBuffer(s.intermediario_foto) && s.intermediario_foto.length > 0) {
                fotoIntermediario = `data:image/jpeg;base64,${s.intermediario_foto.toString('base64')}`;
            }
            
            return {
                id: s.id,
                produto_id: s.produto_id,
                intermediario_id: s.intermediario_id,
                status: s.status,
                data_solicitacao: s.data_solicitacao,
                produto_nome: s.produto_nome,
                preco_minimo: parseFloat(s.preco_minimo),
                comissao_intermediario: parseFloat(s.comissao_intermediario),
                produto_foto: fotoProduto || "https://placehold.co/40x40/2d3748/ffffff?text=P",
                intermediario_nome: s.intermediario_nome,
                intermediario_email: s.intermediario_email,
                intermediario_foto: fotoIntermediario || `https://placehold.co/48x48/4a90d9/ffffff?text=${(s.intermediario_nome || 'I').charAt(0)}`
            };
        });
        
        console.log(`Retornando ${solicitacoesFormatadas.length} solicitações`);
        res.json(solicitacoesFormatadas);
        
    } catch (error) {
        console.error('Erro em getSolicitacoesRecebidas:', error);
        res.status(500).json({ 
            message: 'Erro ao buscar solicitações',
            error: error.message 
        });
    }
};
// Aceitar solicitação
exports.aceitarSolicitacao = async (req, res) => {
    const { solicitacaoId } = req.params;
    const vendedorId = req.user.id;
    
    try {
        // Verificar se a solicitação pertence a este vendedor e está pendente
        const [solicitacao] = await db.execute(
            `SELECT si.id 
             FROM solicitacoes_intermediacao si
             WHERE si.id = ? AND si.vendedor_id = ? AND si.status = 'pendente'`,
            [solicitacaoId, vendedorId]
        );
        
        if (solicitacao.length === 0) {
            return res.status(404).json({ message: "Solicitação não encontrada ou já processada" });
        }
        
        // Atualizar status para 'aceite'
        await db.execute(
            `UPDATE solicitacoes_intermediacao 
             SET status = 'aceite' 
             WHERE id = ?`,
            [solicitacaoId]
        );
        
        console.log(`✅ Solicitação ${solicitacaoId} aceita pelo vendedor ${vendedorId}`);
        res.json({ message: "Solicitação aceita com sucesso!" });
        
    } catch (error) {
        console.error('❌ Erro em aceitarSolicitacao:', error);
        res.status(500).json({ message: "Erro ao aceitar solicitação" });
    }
};

// Rejeitar solicitação
exports.rejeitarSolicitacao = async (req, res) => {
    const { solicitacaoId } = req.params;
    const vendedorId = req.user.id;
    
    try {
        // Verificar se a solicitação pertence a este vendedor e está pendente
        const [solicitacao] = await db.execute(
            `SELECT si.id 
             FROM solicitacoes_intermediacao si
             WHERE si.id = ? AND si.vendedor_id = ? AND si.status = 'pendente'`,
            [solicitacaoId, vendedorId]
        );
        
        if (solicitacao.length === 0) {
            return res.status(404).json({ message: "Solicitação não encontrada ou já processada" });
        }
        
        // Atualizar status para 'rejeitada'
        await db.execute(
            `UPDATE solicitacoes_intermediacao 
             SET status = 'rejeitada' 
             WHERE id = ?`,
            [solicitacaoId]
        );
        
        console.log(`✅ Solicitação ${solicitacaoId} rejeitada pelo vendedor ${vendedorId}`);
        res.json({ message: "Solicitação rejeitada" });
        
    } catch (error) {
        console.error('❌ Erro em rejeitarSolicitacao:', error);
        res.status(500).json({ message: "Erro ao rejeitar solicitação" });
    }
};

// Buscar solicitações por status (para o intermediário ver)
exports.getSolicitacoesPorStatus = async (req, res) => {
    const { status } = req.params;
    const intermediarioId = req.user.id;
    
    try {
        const query = `
            SELECT 
                si.id,
                si.produto_id,
                si.status,
                si.data_solicitacao,
                p.nome as produto_nome,
                p.preco_minimo,
                p.comissao_intermediario,
                p.foto_produto as produto_foto,
                u.nome as vendedor_nome,
                u.email as vendedor_email
            FROM solicitacoes_intermediacao si
            JOIN produtos p ON si.produto_id = p.id
            JOIN usuarios u ON si.vendedor_id = u.id
            WHERE si.intermediario_id = ? AND si.status = ?
            ORDER BY si.data_solicitacao DESC
        `;
        
        const [solicitacoes] = await db.execute(query, [intermediarioId, status]);
        
        // Formatar as imagens
        const solicitacoesFormatadas = solicitacoes.map(s => {
            let fotoProduto = null;
            if (s.produto_foto && Buffer.isBuffer(s.produto_foto) && s.produto_foto.length > 0) {
                fotoProduto = `data:image/jpeg;base64,${s.produto_foto.toString('base64')}`;
            }
            
            return {
                id: s.id,
                produto_id: s.produto_id,
                status: s.status,
                data_solicitacao: s.data_solicitacao,
                produto_nome: s.produto_nome,
                preco_minimo: s.preco_minimo,
                comissao_intermediario: s.comissao_intermediario,
                produto_foto: fotoProduto || "https://placehold.co/40x40/2d3748/ffffff?text=P",
                vendedor_nome: s.vendedor_nome,
                vendedor_email: s.vendedor_email
            };
        });
        
        res.json(solicitacoesFormatadas);
    } catch (error) {
        console.error('Erro em getSolicitacoesPorStatus:', error);
        res.status(500).json({ message: "Erro ao buscar solicitações" });
    }
};
