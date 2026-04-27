const db = require('../config/db');

const Product = {
    getByVendedorId: async (vendedorId) => {
        try {
            const sql = `
                SELECT 
                    p.id, 
                    p.vendedor_id,
                    p.nome, 
                    p.categoria_id,
                    p.descricao, 
                    p.preco_minimo, 
                    p.comissao_intermediario,
                    p.estado, 
                    p.foto_produto,
                    p.provincia,
                    DATE_FORMAT(p.data_cadastro, '%d/%m/%Y %H:%i') as data_cadastro
                FROM produtos p
                WHERE p.vendedor_id = ? AND p.estado != 'removido'
                ORDER BY p.data_cadastro DESC
            `;
            const [rows] = await db.execute(sql, [vendedorId]);
            
            const produtos = rows.map(produto => {
                let foto_url = 'https://placehold.co/300x200/2d3748/ffffff?text=Sem+Imagem';
                
                if (produto.foto_produto && produto.foto_produto.length > 0) {
                    try {
                        if (Buffer.isBuffer(produto.foto_produto)) {
                            foto_url = `data:image/jpeg;base64,${produto.foto_produto.toString('base64')}`;
                        }
                    } catch (err) {
                        console.error("Erro ao converter imagem:", err);
                    }
                }
                
                return {
                    id: produto.id,
                    vendedor_id: produto.vendedor_id,
                    nome: produto.nome,
                    categoria_id: produto.categoria_id,
                    descricao: produto.descricao || '',
                    preco_minimo: parseFloat(produto.preco_minimo),
                    comissao_intermediario: parseFloat(produto.comissao_intermediario || 0),
                    estado: produto.estado,
                    provincia: produto.provincia || '',
                    data_cadastro: produto.data_cadastro,
                    foto_url: foto_url
                };
            });
            
            return produtos;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error.message);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const sql = 'SELECT * FROM produtos WHERE id = ?';
            const [rows] = await db.execute(sql, [id]);
            
            if (rows[0]) {
                if (rows[0].foto_produto && Buffer.isBuffer(rows[0].foto_produto)) {
                    rows[0].foto_url = `data:image/jpeg;base64,${rows[0].foto_produto.toString('base64')}`;
                }
                rows[0].provincia = rows[0].provincia || '';
            }
            
            return rows[0];
        } catch (error) {
            console.error("Erro ao buscar produto por ID:", error.message);
            throw error;
        }
    },

    create: async (produtoData) => {
        const { 
            vendedor_id, 
            categoria_id, 
            nome, 
            descricao, 
            preco_minimo, 
            comissao_intermediario, 
            estado,
            foto_produto,
            provincia
        } = produtoData;
        
        try {
            console.log("=== MODEL create ===");
            console.log("Provincia recebida:", provincia);
            
            let fotoBuffer = null;
            if (foto_produto && foto_produto.startsWith('data:image')) {
                const base64Data = foto_produto.split(',')[1];
                if (base64Data) {
                    fotoBuffer = Buffer.from(base64Data, 'base64');
                }
            }
            
            // SOLUÇÃO: Especificar explicitamente os nomes das colunas
            // Assim a ordem NÃO importa!
            const sql = `
                INSERT INTO produtos 
                SET 
                    vendedor_id = ?,
                    categoria_id = ?,
                    nome = ?,
                    descricao = ?,
                    preco_minimo = ?,
                    comissao_intermediario = ?,
                    estado = ?,
                    foto_produto = ?,
                    provincia = ?,
                    data_cadastro = NOW()
            `;
            
            const values = [
                vendedor_id,
                categoria_id || null,
                nome,
                descricao || '',
                preco_minimo,
                comissao_intermediario || 0,
                estado || 'rascunho',
                fotoBuffer,
                provincia || null
            ];
            
            console.log("SQL:", sql);
            console.log("Values:", values);
            console.log("Provincia no values[8]:", values[8]);
            
            const [result] = await db.execute(sql, values);
            console.log("Produto criado ID:", result.insertId);
            
            return result.insertId;
        } catch (error) {
            console.error("Erro ao criar produto:", error.message);
            throw error;
        }
    },

    update: async (id, produtoData) => {
        const { 
            categoria_id, 
            nome, 
            descricao, 
            preco_minimo, 
            comissao_intermediario, 
            estado,
            provincia
        } = produtoData;
        
        try {
            const updates = [];
            const params = [];
            
            if (nome !== undefined) {
                updates.push("nome = ?");
                params.push(nome);
            }
            if (descricao !== undefined) {
                updates.push("descricao = ?");
                params.push(descricao);
            }
            if (preco_minimo !== undefined) {
                updates.push("preco_minimo = ?");
                params.push(preco_minimo);
            }
            if (categoria_id !== undefined) {
                updates.push("categoria_id = ?");
                params.push(categoria_id);
            }
            if (comissao_intermediario !== undefined) {
                updates.push("comissao_intermediario = ?");
                params.push(comissao_intermediario);
            }
            if (estado !== undefined) {
                updates.push("estado = ?");
                params.push(estado);
            }
            if (provincia !== undefined) {
                updates.push("provincia = ?");
                params.push(provincia);
            }
            
            if (updates.length === 0) {
                return false;
            }
            
            const sql = `UPDATE produtos SET ${updates.join(", ")} WHERE id = ?`;
            params.push(id);
            
            console.log("SQL UPDATE:", sql);
            console.log("Params:", params);
            
            const [result] = await db.execute(sql, params);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error.message);
            throw error;
        }
    },

    updateStatus: async (id, estado) => {
        try {
            const sql = 'UPDATE produtos SET estado = ? WHERE id = ?';
            const [result] = await db.execute(sql, [estado, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao atualizar estado:", error.message);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const sql = 'UPDATE produtos SET estado = ? WHERE id = ?';
            const [result] = await db.execute(sql, ['removido', id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao deletar produto:", error.message);
            throw error;
        }
    },

    belongsToVendedor: async (produtoId, vendedorId) => {
        try {
            const sql = 'SELECT id FROM produtos WHERE id = ? AND vendedor_id = ?';
            const [rows] = await db.execute(sql, [produtoId, vendedorId]);
            return rows.length > 0;
        } catch (error) {
            console.error("Erro ao verificar propriedade:", error.message);
            throw error;
        }
    },

    getStatsByVendedorId: async (vendedorId) => {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_produtos,
                    SUM(CASE WHEN estado = 'publicado' THEN 1 ELSE 0 END) as produtos_publicados,
                    SUM(CASE WHEN estado = 'aguardando_intermediario' THEN 1 ELSE 0 END) as aguardando_intermediario,
                    SUM(CASE WHEN estado = 'rascunho' THEN 1 ELSE 0 END) as rascunhos,
                    SUM(CASE WHEN estado = 'vendido' THEN 1 ELSE 0 END) as vendidos
                FROM produtos 
                WHERE vendedor_id = ? AND estado != 'removido'
            `;
            const [rows] = await db.execute(sql, [vendedorId]);
            
            return {
                total_produtos: parseInt(rows[0].total_produtos) || 0,
                produtos_publicados: parseInt(rows[0].produtos_publicados) || 0,
                aguardando_intermediario: parseInt(rows[0].aguardando_intermediario) || 0,
                rascunhos: parseInt(rows[0].rascunhos) || 0,
                vendidos: parseInt(rows[0].vendidos) || 0
            };
        } catch (error) {
            console.error("Erro ao buscar estatisticas:", error.message);
            throw error;
        }
    }
};

module.exports = Product;