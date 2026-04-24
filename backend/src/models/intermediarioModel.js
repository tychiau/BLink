const db = require('../config/db');

const Intermediario = {

    /**
     * Produtos publicados disponíveis para intermediação
     * (não vinculados a este intermediário, estado = publicado)
     */
    getProdutosDisponiveis: async (intermediarioId) => {
        try {
            const sql = `
                SELECT
                    p.id,
                    p.nome,
                    p.descricao,
                    p.preco_minimo,
                    p.comissao_intermediario,
                    p.estado,
                    p.provincia,
                    p.foto_produto,
                    DATE_FORMAT(p.data_cadastro, '%d/%m/%Y') AS data_cadastro,
                    u.nome AS vendedor_nome,
                    c.nome AS categoria_nome
                FROM produtos p
                LEFT JOIN usuarios u ON u.id = p.vendedor_id
                LEFT JOIN categorias c ON c.id = p.categoria_id
                WHERE p.estado = 'publicado'
                  AND p.id NOT IN (
                      SELECT si.produto_id
                      FROM solicitacoes_intermediacao si
                      WHERE si.intermediario_id = ?
                        AND si.status IN ('pendente', 'aceite')
                  )
                ORDER BY p.data_cadastro DESC
            `;
            const [rows] = await db.execute(sql, [intermediarioId]);

            return rows.map(p => {
                let foto_url = 'https://placehold.co/300x200/2d3748/ffffff?text=Sem+Imagem';
                if (p.foto_produto && Buffer.isBuffer(p.foto_produto) && p.foto_produto.length > 0) {
                    try {
                        foto_url = `data:image/jpeg;base64,${p.foto_produto.toString('base64')}`;
                    } catch (_) {}
                }
                return {
                    id: p.id,
                    nome: p.nome,
                    descricao: p.descricao || '',
                    preco_minimo: parseFloat(p.preco_minimo),
                    comissao_intermediario: parseFloat(p.comissao_intermediario || 0),
                    estado: p.estado,
                    provincia: p.provincia || '',
                    foto_url,
                    data_cadastro: p.data_cadastro,
                    vendedor_nome: p.vendedor_nome || '',
                    categoria_nome: p.categoria_nome || ''
                };
            });
        } catch (error) {
            console.error('Erro ao buscar produtos disponíveis:', error.message);
            throw error;
        }
    },

    /**
     * Novos produtos publicados (últimos 30 dias) disponíveis para intermediação
     */
    getNovoProdutos: async (intermediarioId) => {
        try {
            const sql = `
                SELECT
                    p.id,
                    p.nome,
                    p.descricao,
                    p.preco_minimo,
                    p.comissao_intermediario,
                    p.estado,
                    p.provincia,
                    p.foto_produto,
                    DATE_FORMAT(p.data_cadastro, '%d/%m/%Y') AS data_cadastro,
                    u.nome AS vendedor_nome,
                    c.nome AS categoria_nome
                FROM produtos p
                LEFT JOIN usuarios u ON u.id = p.vendedor_id
                LEFT JOIN categorias c ON c.id = p.categoria_id
                WHERE p.estado = 'publicado'
                  AND p.data_cadastro >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  AND p.id NOT IN (
                      SELECT si.produto_id
                      FROM solicitacoes_intermediacao si
                      WHERE si.intermediario_id = ?
                        AND si.status IN ('pendente', 'aceite')
                  )
                ORDER BY p.data_cadastro DESC
            `;
            const [rows] = await db.execute(sql, [intermediarioId]);

            return rows.map(p => {
                let foto_url = 'https://placehold.co/300x200/2d3748/ffffff?text=Sem+Imagem';
                if (p.foto_produto && Buffer.isBuffer(p.foto_produto) && p.foto_produto.length > 0) {
                    try {
                        foto_url = `data:image/jpeg;base64,${p.foto_produto.toString('base64')}`;
                    } catch (_) {}
                }
                return {
                    id: p.id,
                    nome: p.nome,
                    descricao: p.descricao || '',
                    preco_minimo: parseFloat(p.preco_minimo),
                    comissao_intermediario: parseFloat(p.comissao_intermediario || 0),
                    estado: p.estado,
                    provincia: p.provincia || '',
                    foto_url,
                    data_cadastro: p.data_cadastro,
                    vendedor_nome: p.vendedor_nome || '',
                    categoria_nome: p.categoria_nome || ''
                };
            });
        } catch (error) {
            console.error('Erro ao buscar novos produtos:', error.message);
            throw error;
        }
    },

    /**
     * Produtos activos do intermediário (solicitações aceites)
     */
    getProdutosAtivos: async (intermediarioId) => {
        try {
            const sql = `
                SELECT
                    p.id,
                    p.nome,
                    p.descricao,
                    p.preco_minimo,
                    p.comissao_intermediario,
                    p.estado,
                    p.provincia,
                    p.foto_produto,
                    DATE_FORMAT(si.data_solicitacao, '%d/%m/%Y') AS data_vinculo,
                    u.nome AS vendedor_nome,
                    c.nome AS categoria_nome
                FROM solicitacoes_intermediacao si
                INNER JOIN produtos p ON p.id = si.produto_id
                LEFT JOIN usuarios u ON u.id = p.vendedor_id
                LEFT JOIN categorias c ON c.id = p.categoria_id
                WHERE si.intermediario_id = ?
                  AND si.status = 'aceite'
                  AND p.estado != 'removido'
                ORDER BY si.data_solicitacao DESC
            `;
            const [rows] = await db.execute(sql, [intermediarioId]);

            return rows.map(p => {
                let foto_url = 'https://placehold.co/300x200/2d3748/ffffff?text=Sem+Imagem';
                if (p.foto_produto && Buffer.isBuffer(p.foto_produto) && p.foto_produto.length > 0) {
                    try {
                        foto_url = `data:image/jpeg;base64,${p.foto_produto.toString('base64')}`;
                    } catch (_) {}
                }
                return {
                    id: p.id,
                    nome: p.nome,
                    descricao: p.descricao || '',
                    preco_minimo: parseFloat(p.preco_minimo),
                    comissao_intermediario: parseFloat(p.comissao_intermediario || 0),
                    estado: p.estado,
                    provincia: p.provincia || '',
                    foto_url,
                    data_vinculo: p.data_vinculo,
                    vendedor_nome: p.vendedor_nome || '',
                    categoria_nome: p.categoria_nome || ''
                };
            });
        } catch (error) {
            console.error('Erro ao buscar produtos ativos:', error.message);
            throw error;
        }
    },

    /**
     * Aprovações pendentes — solicitações aguardando resposta do vendedor
     */
    getAprovacoesPendentes: async (intermediarioId) => {
        try {
            const sql = `
                SELECT
                    si.id AS solicitacao_id,
                    si.status,
                    DATE_FORMAT(si.data_solicitacao, '%d/%m/%Y') AS data_solicitacao,
                    p.id AS produto_id,
                    p.nome AS produto_nome,
                    p.preco_minimo,
                    p.comissao_intermediario,
                    p.foto_produto,
                    u.nome AS vendedor_nome,
                    u.id AS vendedor_id
                FROM solicitacoes_intermediacao si
                INNER JOIN produtos p ON p.id = si.produto_id
                LEFT JOIN usuarios u ON u.id = p.vendedor_id
                WHERE si.intermediario_id = ?
                  AND si.status = 'pendente'
                ORDER BY si.data_solicitacao DESC
            `;
            const [rows] = await db.execute(sql, [intermediarioId]);

            return rows.map(r => {
                let foto_url = 'https://placehold.co/60x60/2d3748/ffffff?text=P';
                if (r.foto_produto && Buffer.isBuffer(r.foto_produto) && r.foto_produto.length > 0) {
                    try {
                        foto_url = `data:image/jpeg;base64,${r.foto_produto.toString('base64')}`;
                    } catch (_) {}
                }
                return {
                    solicitacao_id: r.solicitacao_id,
                    status: r.status,
                    data_solicitacao: r.data_solicitacao,
                    produto_id: r.produto_id,
                    produto_nome: r.produto_nome,
                    preco_minimo: parseFloat(r.preco_minimo),
                    comissao_intermediario: parseFloat(r.comissao_intermediario || 0),
                    foto_url,
                    vendedor_nome: r.vendedor_nome || '',
                    vendedor_id: r.vendedor_id
                };
            });
        } catch (error) {
            console.error('Erro ao buscar aprovações pendentes:', error.message);
            throw error;
        }
    },

    /**
     * Vendas activas do intermediário (status = retido)
     */
    getVendasAtivas: async (intermediarioId) => {
        try {
            const sql = `
                SELECT
                    v.id,
                    v.valor_final,
                    v.status_venda,
                    DATE_FORMAT(v.data_venda, '%d/%m/%Y') AS data_venda,
                    p.nome AS produto_nome,
                    p.comissao_intermediario,
                    p.foto_produto,
                    u_cliente.nome AS cliente_nome
                FROM vendas v
                INNER JOIN produtos p ON p.id = v.produto_id
                LEFT JOIN usuarios u_cliente ON u_cliente.id = v.cliente_id
                WHERE v.intermediario_id = ?
                  AND v.status_venda = 'retido'
                ORDER BY v.data_venda DESC
            `;
            const [rows] = await db.execute(sql, [intermediarioId]);

            return rows.map(v => {
                let foto_url = 'https://placehold.co/60x60/2d3748/ffffff?text=P';
                if (v.foto_produto && Buffer.isBuffer(v.foto_produto) && v.foto_produto.length > 0) {
                    try {
                        foto_url = `data:image/jpeg;base64,${v.foto_produto.toString('base64')}`;
                    } catch (_) {}
                }
                const valor = parseFloat(v.valor_final);
                const comissaoPct = parseFloat(v.comissao_intermediario || 0);
                const ganho = parseFloat(((valor * comissaoPct) / 100).toFixed(2));
                return {
                    id: v.id,
                    valor_final: valor,
                    ganho_estimado: ganho,
                    comissao_pct: comissaoPct,
                    status_venda: v.status_venda,
                    data_venda: v.data_venda,
                    produto_nome: v.produto_nome,
                    foto_url,
                    cliente_nome: v.cliente_nome || 'Cliente'
                };
            });
        } catch (error) {
            console.error('Erro ao buscar vendas ativas:', error.message);
            throw error;
        }
    },

    /**
     * Histórico de ganhos — vendas liquidadas
     */
    getHistoricoGanhos: async (intermediarioId) => {
        try {
            const sql = `
                SELECT
                    v.id,
                    v.valor_final,
                    v.status_venda,
                    DATE_FORMAT(v.data_venda, '%d/%m/%Y') AS data_venda,
                    YEAR(v.data_venda) AS ano,
                    MONTH(v.data_venda) AS mes,
                    p.nome AS produto_nome,
                    p.comissao_intermediario,
                    p.foto_produto,
                    u_cliente.nome AS cliente_nome
                FROM vendas v
                INNER JOIN produtos p ON p.id = v.produto_id
                LEFT JOIN usuarios u_cliente ON u_cliente.id = v.cliente_id
                WHERE v.intermediario_id = ?
                  AND v.status_venda IN ('liquidado', 'retido', 'estornado')
                ORDER BY v.data_venda DESC
            `;
            const [rows] = await db.execute(sql, [intermediarioId]);

            return rows.map(v => {
                let foto_url = 'https://placehold.co/60x60/2d3748/ffffff?text=P';
                if (v.foto_produto && Buffer.isBuffer(v.foto_produto) && v.foto_produto.length > 0) {
                    try {
                        foto_url = `data:image/jpeg;base64,${v.foto_produto.toString('base64')}`;
                    } catch (_) {}
                }
                const valor = parseFloat(v.valor_final);
                const comissaoPct = parseFloat(v.comissao_intermediario || 0);
                const ganho = parseFloat(((valor * comissaoPct) / 100).toFixed(2));
                return {
                    id: v.id,
                    valor_final: valor,
                    ganho: ganho,
                    comissao_pct: comissaoPct,
                    status_venda: v.status_venda,
                    data_venda: v.data_venda,
                    ano: v.ano,
                    mes: v.mes,
                    produto_nome: v.produto_nome,
                    foto_url,
                    cliente_nome: v.cliente_nome || 'Cliente'
                };
            });
        } catch (error) {
            console.error('Erro ao buscar histórico de ganhos:', error.message);
            throw error;
        }
    },

    /**
     * Comissão mensal do intermediário (mês actual)
     */
    getComissaoMensal: async (intermediarioId) => {
        try {
            const sql = `
                SELECT
                    COALESCE(SUM((v.valor_final * p.comissao_intermediario) / 100), 0) AS comissao_total,
                    COUNT(v.id) AS total_vendas,
                    MONTH(NOW()) AS mes_atual,
                    YEAR(NOW()) AS ano_atual
                FROM vendas v
                INNER JOIN produtos p ON p.id = v.produto_id
                WHERE v.intermediario_id = ?
                  AND v.status_venda IN ('liquidado', 'retido')
                  AND MONTH(v.data_venda) = MONTH(NOW())
                  AND YEAR(v.data_venda) = YEAR(NOW())
            `;
            const [rows] = await db.execute(sql, [intermediarioId]);
            return {
                comissao_total: parseFloat(rows[0].comissao_total || 0).toFixed(2),
                total_vendas: parseInt(rows[0].total_vendas || 0),
                mes: parseInt(rows[0].mes_atual),
                ano: parseInt(rows[0].ano_atual)
            };
        } catch (error) {
            console.error('Erro ao calcular comissão mensal:', error.message);
            throw error;
        }
    },

    /**
     * Estatísticas gerais do intermediário (dashboard)
     */
    getStats: async (intermediarioId) => {
        try {
            // Produtos activos (vinculados)
            const [ativos] = await db.execute(
                `SELECT COUNT(*) AS total FROM solicitacoes_intermediacao
                 WHERE intermediario_id = ? AND status = 'aceite'`,
                [intermediarioId]
            );

            // Vendas realizadas (total histórico)
            const [vendas] = await db.execute(
                `SELECT COUNT(*) AS total FROM vendas
                 WHERE intermediario_id = ? AND status_venda IN ('liquidado', 'retido')`,
                [intermediarioId]
            );

            // Aprovações pendentes
            const [pendentes] = await db.execute(
                `SELECT COUNT(*) AS total FROM solicitacoes_intermediacao
                 WHERE intermediario_id = ? AND status = 'pendente'`,
                [intermediarioId]
            );

            // Comissão do mês actual
            const [comissao] = await db.execute(
                `SELECT COALESCE(SUM((v.valor_final * p.comissao_intermediario) / 100), 0) AS total
                 FROM vendas v
                 INNER JOIN produtos p ON p.id = v.produto_id
                 WHERE v.intermediario_id = ?
                   AND v.status_venda IN ('liquidado', 'retido')
                   AND MONTH(v.data_venda) = MONTH(NOW())
                   AND YEAR(v.data_venda) = YEAR(NOW())`,
                [intermediarioId]
            );

            // Taxa de conversão (vendas realizadas / produtos activos)
            const totalAtivos = parseInt(ativos[0].total || 0);
            const totalVendas = parseInt(vendas[0].total || 0);
            const taxa = totalAtivos > 0
                ? parseFloat(((totalVendas / totalAtivos) * 100).toFixed(1))
                : 0;

            return {
                produtos_ativos: totalAtivos,
                vendas_realizadas: totalVendas,
                aprovacoes_pendentes: parseInt(pendentes[0].total || 0),
                comissao_mes: parseFloat(comissao[0].total || 0).toFixed(2),
                taxa_conversao: taxa
            };
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error.message);
            throw error;
        }
    },

    /**
     * Criar solicitação de intermediação (vincular produto)
     */
    criarSolicitacao: async (intermediarioId, produtoId) => {
        try {
            // Verificar se já existe solicitação activa para este par
            const [existente] = await db.execute(
                `SELECT id FROM solicitacoes_intermediacao
                 WHERE intermediario_id = ? AND produto_id = ? AND status IN ('pendente', 'aceite')`,
                [intermediarioId, produtoId]
            );
            if (existente.length > 0) {
                return { jaExiste: true };
            }

            // Verificar se o produto existe e está publicado
            const [produto] = await db.execute(
                `SELECT id FROM produtos WHERE id = ? AND estado = 'publicado'`,
                [produtoId]
            );
            if (produto.length === 0) {
                return { produtoIndisponivel: true };
            }

            // Gerar UUID via MySQL para não depender de pacotes externos
            const [[{ uuid: id }]] = await db.execute('SELECT UUID() AS uuid');

            await db.execute(
                `INSERT INTO solicitacoes_intermediacao (id, produto_id, intermediario_id, status, data_solicitacao)
                 VALUES (?, ?, ?, 'pendente', NOW())`,
                [id, produtoId, intermediarioId]
            );

            return { id, sucesso: true };
        } catch (error) {
            console.error('Erro ao criar solicitação:', error.message);
            throw error;
        }
    },

    /**
     * Cancelar / remover solicitação de intermediação
     */
    cancelarSolicitacao: async (intermediarioId, solicitacaoId) => {
        try {
            const [result] = await db.execute(
                `DELETE FROM solicitacoes_intermediacao
                 WHERE id = ? AND intermediario_id = ? AND status = 'pendente'`,
                [solicitacaoId, intermediarioId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao cancelar solicitação:', error.message);
            throw error;
        }
    }
};

module.exports = Intermediario;
