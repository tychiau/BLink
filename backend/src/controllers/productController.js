const Product = require('../models/productModel');
const db = require('../config/db'); // ADICIONE ESTA LINHA

// Listar produtos do vendedor logado
exports.listMyProducts = async (req, res) => {
    try {
        const vendedorId = req.user.id;
        console.log("Buscando produtos para vendedor:", vendedorId);
        
        const products = await Product.getByVendedorId(vendedorId);
        console.log(`Encontrados ${products.length} produtos`);
        
        res.status(200).json(products);
    } catch (error) {
        console.error("Erro em listMyProducts:", error);
        res.status(500).json({ message: "Erro ao buscar seus produtos.", error: error.message });
    }
};

// Buscar produto especifico
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getById(id);
        
        if (!product) {
            return res.status(404).json({ message: "Produto nao encontrado." });
        }
        
        const pertence = await Product.belongsToVendedor(id, req.user.id);
        if (!pertence && req.user.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: "Acesso negado." });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error("Erro em getProductById:", error);
        res.status(500).json({ message: "Erro ao buscar produto." });
    }
};

// Criar novo produto
exports.createProduct = async (req, res) => {
    try {
        console.log("===== CREATE PRODUCT =====");
        console.log("Body recebido:", req.body);
        
        const { 
            categoria_id, 
            nome, 
            descricao, 
            preco_minimo, 
            comissao_intermediario, 
            provincia,
            estado,
            foto_produto,
        } = req.body;
        
        const vendedor_id = req.user.id;
        
        console.log("Vendedor ID:", vendedor_id);
        console.log("Provincia recebida:", provincia);
        console.log("Tipo da provincia:", typeof provincia);
        
        if (!nome || !preco_minimo) {
            return res.status(400).json({ message: "Nome e preco sao obrigatorios." });
        }
        
        const productId = await Product.create({
            vendedor_id: String(vendedor_id),
            categoria_id: categoria_id ? String(categoria_id) : null,
            nome,
            descricao: descricao || '',
            preco_minimo: parseFloat(preco_minimo),
            comissao_intermediario: parseFloat(comissao_intermediario) || 0,
            estado: estado || 'rascunho',
            foto_produto: foto_produto || null,
            provincia: provincia || null
        });
        
        console.log("Produto criado com ID:", productId);
        
        const newProduct = await Product.getById(productId);
        console.log("Produto criado (com provincia):", newProduct);
        
        res.status(201).json({ 
            message: "Produto criado com sucesso!", 
            product: newProduct,
            productId: productId
        });
    } catch (error) {
        console.error("Erro detalhado em createProduct:", error);
        res.status(500).json({ message: "Erro ao criar produto.", error: error.message });
    }
};

// Atualizar produto
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        console.log("=== UPDATE PRODUCT ===");
        console.log("Produto ID:", id);
        console.log("Dados para atualizar:", updates);
        
        const product = await Product.getById(id);
        if (!product) {
            return res.status(404).json({ message: "Produto nao encontrado." });
        }
        
        const pertence = await Product.belongsToVendedor(id, req.user.id);
        if (!pertence && req.user.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: "Acesso negado." });
        }
        
        const updated = await Product.update(id, updates);
        
        if (updated) {
            const updatedProduct = await Product.getById(id);
            res.status(200).json({ 
                message: "Produto atualizado com sucesso!", 
                product: updatedProduct 
            });
        } else {
            res.status(400).json({ message: "Nenhuma alteracao foi feita." });
        }
    } catch (error) {
        console.error("Erro em updateProduct:", error);
        res.status(500).json({ message: "Erro ao atualizar produto.", error: error.message });
    }
};

// Atualizar estado do produto
exports.updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        const estadosValidos = ['rascunho', 'aguardando_intermediario', 'publicado', 'vendido', 'removido'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: "Estado invalido." });
        }
        
        const pertence = await Product.belongsToVendedor(id, req.user.id);
        if (!pertence && req.user.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: "Acesso negado." });
        }
        
        const updated = await Product.updateStatus(id, estado);
        
        if (updated) {
            res.status(200).json({ message: `Produto ${estado === 'publicado' ? 'publicado' : estado === 'rascunho' ? 'salvo como rascunho' : 'status atualizado'} com sucesso!` });
        } else {
            res.status(400).json({ message: "Erro ao atualizar status." });
        }
    } catch (error) {
        console.error("Erro em updateProductStatus:", error);
        res.status(500).json({ message: "Erro ao atualizar status do produto." });
    }
};

// Deletar produto (soft delete)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const pertence = await Product.belongsToVendedor(id, req.user.id);
        if (!pertence && req.user.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: "Acesso negado." });
        }
        
        const deleted = await Product.delete(id);
        
        if (deleted) {
            res.status(200).json({ message: "Produto removido com sucesso!" });
        } else {
            res.status(404).json({ message: "Produto nao encontrado." });
        }
    } catch (error) {
        console.error("Erro em deleteProduct:", error);
        res.status(500).json({ message: "Erro ao remover produto." });
    }
};

// Obter estatisticas do vendedor
exports.getVendorStats = async (req, res) => {
    try {
        const vendedorId = req.user.id;
        console.log("Buscando estatisticas para vendedor:", vendedorId);
        
        const stats = await Product.getStatsByVendedorId(vendedorId);
        console.log("Estatisticas encontradas:", stats);
        
        res.status(200).json(stats);
    } catch (error) {
        console.error("Erro em getVendorStats:", error);
        res.status(500).json({ message: "Erro ao buscar estatisticas." });
    }
};

// Adicione esta função ANTES do module.exports
exports.testProvincia = async (req, res) => {
    try {
        const { provincia } = req.body;
        console.log("=== TESTE PROVINCIA ===");
        console.log("Provincia recebida:", provincia);
        console.log("Usuário ID:", req.user.id);
        
        const db = require('../config/db');
        
        // Verificar se a coluna provincia existe
        const [columns] = await db.execute("SHOW COLUMNS FROM produtos LIKE 'provincia'");
        console.log("Coluna provincia existe?", columns.length > 0);
        
        if (columns.length === 0) {
            return res.status(400).json({ 
                error: "Coluna 'provincia' não existe na tabela produtos",
                suggestion: "Execute no MySQL: ALTER TABLE produtos ADD COLUMN provincia VARCHAR(100) DEFAULT NULL"
            });
        }
        
        // Inserir produto de teste
        const sql = 'INSERT INTO produtos (vendedor_id, nome, preco_minimo, provincia) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(sql, [req.user.id, 'TESTE API PROVINCIA', 100, provincia]);
        
        // Verificar se foi salvo
        const [check] = await db.execute('SELECT id, nome, provincia FROM produtos WHERE id = ?', [result.insertId]);
        
        res.json({ 
            success: true, 
            id: result.insertId, 
            provincia_enviada: provincia,
            provincia_salva: check[0]?.provincia
        });
    } catch (error) {
        console.error("Erro no testProvincia:", error);
        res.status(500).json({ error: error.message });
    }
    exports.createProduct = async (req, res) => {
    try {
        console.log("=== CREATE PRODUCT ===");
        console.log("Body COMPLETO:", JSON.stringify(req.body));
        console.log("Campo provincia:", req.body.provincia);
        console.log("Campo provincia existe?", req.body.hasOwnProperty('provincia'));
        
        const { 
            categoria_id, 
            nome, 
            descricao, 
            preco_minimo, 
            comissao_intermediario, 
            provincia,
            estado,
            foto_produto,
        } = req.body;
        
        // SE PROVINCIA NÃO EXISTIR NO BODY, TENTAR PEGAR DE OUTRA FORMA
        let provinciaFinal = provincia;
        if (!provinciaFinal && req.body.provincia) {
            provinciaFinal = req.body.provincia;
        }
        
        console.log("Provincia final a ser salva:", provinciaFinal);
        
        const vendedor_id = req.user.id;
        
        if (!nome || !preco_minimo) {
            return res.status(400).json({ message: "Nome e preco sao obrigatorios." });
        }
        
        const productId = await Product.create({
            vendedor_id: String(vendedor_id),
            categoria_id: categoria_id ? String(categoria_id) : null,
            nome,
            descricao: descricao || '',
            preco_minimo: parseFloat(preco_minimo),
            comissao_intermediario: parseFloat(comissao_intermediario) || 0,
            estado: estado || 'rascunho',
            foto_produto: foto_produto || null,
            provincia: provinciaFinal
        });
        
        const newProduct = await Product.getById(productId);
        
        res.status(201).json({ 
            message: "Produto criado com sucesso!", 
            product: newProduct,
            debug_provincia_recebida: provincia,
            debug_provincia_salva: newProduct?.provincia
        });
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({ message: "Erro ao criar produto.", error: error.message });
    }
};
};
