const db = require('../config/db');

const Product = {
    // Buscar produtos de um vendedor específico
    getByVendedorId: async (vendedorId) => {
        try {
            const sql = `
                SELECT 
                    id, 
                    nome, 
                    categoria_id,
                    descricao, 
                    preco_minimo, 
                    comissao_intermediario,
                    estado, 
                    foto_produto,
                    DATE_FORMAT(data_cadastro, '%d/%m/%Y %H:%i') as data_cadastro
                FROM produtos 
                WHERE vendedor_id = ? AND estado != 'removido'
                ORDER BY data_cadastro DESC
            `;
            const [rows] = await db.execute(sql, [vendedorId]);
            
            // Converter foto_produto para base64 se existir
            const produtos = rows.map(produto => ({
                ...produto,
                foto_url: produto.foto_produto ? 
                    `data:image/jpeg;base64,${produto.foto_produto.toString('base64')}` : 
                    'https://placehold.co/300x200/2d3748/ffffff?text=Sem+Imagem'
            }));
            
            return produtos;
        } catch (error) {
            console.error("Erro ao buscar produtos do vendedor:", error.message);
            throw error;
        }
    },

    // Buscar produto por ID
    getById: async (id) => {
        try {
            const sql = 'SELECT * FROM produtos WHERE id = ?';
            const [rows] = await db.execute(sql, [id]);
            return rows[0];
        } catch (error) {
            console.error("Erro ao buscar produto por ID:", error.message);
            throw error;
        }
    },

    // Criar novo produto
    create: async (produtoData) => {
        const { 
            vendedor_id, 
            categoria_id, 
            nome, 
            descricao, 
            preco_minimo, 
            comissao_intermediario, 
            estado,
            foto_produto 
        } = produtoData;
        
        try {
            const sql = `
                INSERT INTO produtos 
                (vendedor_id, categoria_id, nome, descricao, preco_minimo, 
                 comissao_intermediario, estado, foto_produto, data_cadastro) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;
            const [result] = await db.execute(sql, [
                vendedor_id, 
                categoria_id, 
                nome, 
                descricao, 
                preco_minimo, 
                comissao_intermediario, 
                estado || 'rascunho',
                foto_produto || null
            ]);
            return result.insertId;
        } catch (error) {
            console.error("Erro ao criar produto:", error.message);
            throw error;
        }
    },

    // Atualizar produto
    update: async (id, produtoData) => {
        const { 
            categoria_id, 
            nome, 
            descricao, 
            preco_minimo, 
            comissao_intermediario, 
            estado,
            foto_produto 
        } = produtoData;
        
        try {
            let sql = `
                UPDATE produtos 
                SET categoria_id = ?, nome = ?, descricao = ?, 
                    preco_minimo = ?, comissao_intermediario = ?, estado = ?
            `;
            const params = [categoria_id, nome, descricao, preco_minimo, comissao_intermediario, estado];
            
            if (foto_produto) {
                sql += `, foto_produto = ?`;
                params.push(foto_produto);
            }
            
            sql += ` WHERE id = ?`;
            params.push(id);
            
            const [result] = await db.execute(sql, params);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error.message);
            throw error;
        }
    },

    // Atualizar estado do produto
    updateStatus: async (id, estado) => {
        try {
            const sql = 'UPDATE produtos SET estado = ? WHERE id = ?';
            const [result] = await db.execute(sql, [estado, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao atualizar estado do produto:", error.message);
            throw error;
        }
    },

    // Deletar produto (soft delete - muda estado para 'removido')
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

    // Verificar se produto pertence ao vendedor
    belongsToVendedor: async (produtoId, vendedorId) => {
        try {
            const sql = 'SELECT id FROM produtos WHERE id = ? AND vendedor_id = ?';
            const [rows] = await db.execute(sql, [produtoId, vendedorId]);
            return rows.length > 0;
        } catch (error) {
            console.error("Erro ao verificar propriedade do produto:", error.message);
            throw error;
        }
    },

    // Buscar estatísticas do vendedor
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
            return rows[0];
        } catch (error) {
            console.error("Erro ao buscar estatísticas:", error.message);
            throw error;
        }
    }
};

module.exports = Product;