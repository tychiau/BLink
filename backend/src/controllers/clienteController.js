
exports.solicitarCompra = async (req, res) => {
    try {
        const clienteId = req.user.id;
        const { produto_id, intermediario_id, valor_final } = req.body;
        
        console.log("=== SOLICITAÇÃO DE COMPRA ===");
        console.log("Cliente ID:", clienteId);
        console.log("Body:", req.body);
        
        // Buscar dados do cliente para validação
        const [cliente] = await db.execute(
            'SELECT id, nome FROM usuarios WHERE id = ? AND tipo_usuario = "cliente"',
            [clienteId]
        );
        
        if (cliente.length === 0) {
            return res.status(404).json({ message: "Cliente não encontrado" });
        }
        
        // Buscar dados do intermediário para validação
        const [intermediario] = await db.execute(
            'SELECT id, nome FROM usuarios WHERE id = ? AND tipo_usuario = "intermediario"',
            [intermediario_id]
        );
        
        if (intermediario.length === 0) {
            return res.status(404).json({ message: "Intermediário não encontrado" });
        }
        
        // Buscar dados do produto
        const [produto] = await db.execute(
            'SELECT id, nome FROM produtos WHERE id = ? AND estado = "publicado"',
            [produto_id]
        );
        
        if (produto.length === 0) {
            return res.status(404).json({ message: "Produto não encontrado ou indisponível" });
        }
        
        // Verificar se já existe solicitação pendente (status 'retido')
        const [existente] = await db.execute(
            `SELECT id FROM vendas 
             WHERE cliente_id = ? AND produto_id = ? AND status_venda = 'retido'`,
            [clienteId, produto_id]
        );
        
        if (existente.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: "Você já possui uma solicitação pendente para este produto" 
            });
        }
        
        // Gerar ID único
        const [uuidResult] = await db.execute('SELECT UUID() as uuid');
        const vendaId = uuidResult[0].uuid;
        
        // Inserir na tabela vendas com status 'retido'
        await db.execute(
            `INSERT INTO vendas (
                id, produto_id, cliente_id, intermediario_id, valor_final, status_venda, data_venda
            ) VALUES (?, ?, ?, ?, ?, 'retido', NOW())`,
            [vendaId, produto_id, clienteId, intermediario_id, valor_final]
        );
        
        console.log(`✅ Venda criada com ID: ${vendaId}`);
        
        res.status(201).json({ 
            success: true, 
            message: "Solicitação de compra enviada ao intermediário!",
            venda_id: vendaId
        });
        
    } catch (error) {
        console.error('Erro ao solicitar compra:', error);
        res.status(500).json({ message: "Erro ao solicitar compra" });
    }
};

/**
 * Cliente busca suas solicitações (carrinho - status 'retido')
 * GET /api/cliente/minhas-solicitacoes
 */
exports.minhasSolicitacoes = async (req, res) => {
    try {
        const clienteId = req.user.id;
        
        const [rows] = await db.execute(
            `SELECT 
                v.id,
                v.produto_id,
                v.valor_final,
                v.status_venda,
                v.data_venda,
                p.nome as produto_nome,
                p.foto_produto,
                u.nome as intermediario_nome
             FROM vendas v
             INNER JOIN produtos p ON v.produto_id = p.id
             INNER JOIN usuarios u ON v.intermediario_id = u.id
             WHERE v.cliente_id = ? AND v.status_venda IN ('retido')
             ORDER BY v.data_venda DESC`,
            [clienteId]
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
                valor: parseFloat(v.valor_final),
                valor_formatado: `${parseFloat(v.valor_final).toLocaleString()} MZN`,
                status: v.status_venda,
                intermediario_nome: v.intermediario_nome,
                foto_produto: fotoProduto || "https://placehold.co/80x80/1e3a5f/ffffff?text=P",
                data_solicitacao: v.data_venda
            };
        });
        
        res.json(solicitacoes);
    } catch (error) {
        console.error('Erro ao buscar solicitações do cliente:', error);
        res.status(500).json({ message: "Erro ao buscar solicitações" });
    }
};

/**
 * Cliente cancela solicitação (remove do carrinho)
 * DELETE /api/cliente/cancelar-solicitacao/:solicitacaoId
 */
exports.cancelarSolicitacao = async (req, res) => {
    const { solicitacaoId } = req.params;
    const clienteId = req.user.id;
    
    try {
        const [result] = await db.execute(
            `DELETE FROM vendas 
             WHERE id = ? AND cliente_id = ? AND status_venda = 'retido'`,
            [solicitacaoId, clienteId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Solicitação não encontrada" });
        }
        
        res.json({ success: true, message: "Solicitação cancelada com sucesso" });
        
    } catch (error) {
        console.error('Erro ao cancelar:', error);
        res.status(500).json({ message: "Erro ao cancelar solicitação" });
    }
};