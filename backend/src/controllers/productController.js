const Product = require('../models/productModel');

// Listar produtos do vendedor logado
exports.listMyProducts = async (req, res) => {
    try {
        const vendedorId = req.user.id;
        const products = await Product.getByVendedorId(vendedorId);
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar seus produtos." });
    }
};

// Buscar produto específico
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getById(id);
        
        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }
        
        // Verificar se o produto pertence ao vendedor logado
        const pertence = await Product.belongsToVendedor(id, req.user.id);
        if (!pertence && req.user.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: "Acesso negado." });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar produto." });
    }
};

// Criar novo produto
exports.createProduct = async (req, res) => {
    try {
        const { 
            categoria_id, 
            nome, 
            descricao, 
            preco_minimo, 
            comissao_intermediario, 
            estado,
            foto_produto 
        } = req.body;
        
        const vendedor_id = req.user.id;
        
        // Validações básicas
        if (!nome || !preco_minimo) {
            return res.status(400).json({ message: "Nome e preço são obrigatórios." });
        }
        
        const productId = await Product.create({
            vendedor_id,
            categoria_id: categoria_id || null,
            nome,
            descricao: descricao || '',
            preco_minimo,
            comissao_intermediario: comissao_intermediario || 0,
            estado: estado || 'rascunho',
            foto_produto: foto_produto || null
        });
        
        const newProduct = await Product.getById(productId);
        res.status(201).json({ message: "Produto criado com sucesso!", product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar produto." });
    }
};

// Atualizar produto
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Verificar se produto existe e pertence ao vendedor
        const product = await Product.getById(id);
        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }
        
        const pertence = await Product.belongsToVendedor(id, req.user.id);
        if (!pertence && req.user.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: "Acesso negado." });
        }
        
        const updated = await Product.update(id, updates);
        
        if (updated) {
            const updatedProduct = await Product.getById(id);
            res.status(200).json({ message: "Produto atualizado com sucesso!", product: updatedProduct });
        } else {
            res.status(400).json({ message: "Nenhuma alteração foi feita." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar produto." });
    }
};

// Atualizar estado do produto
exports.updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        const estadosValidos = ['rascunho', 'aguardando_intermediario', 'publicado', 'vendido', 'removido'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: "Estado inválido." });
        }
        
        // Verificar propriedade
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
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar status do produto." });
    }
};

// Deletar produto (soft delete)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar propriedade
        const pertence = await Product.belongsToVendedor(id, req.user.id);
        if (!pertence && req.user.tipo_usuario !== 'admin') {
            return res.status(403).json({ message: "Acesso negado." });
        }
        
        const deleted = await Product.delete(id);
        
        if (deleted) {
            res.status(200).json({ message: "Produto removido com sucesso!" });
        } else {
            res.status(404).json({ message: "Produto não encontrado." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao remover produto." });
    }
};

// Obter estatísticas do vendedor
exports.getVendorStats = async (req, res) => {
    try {
        const vendedorId = req.user.id;
        const stats = await Product.getStatsByVendedorId(vendedorId);
        res.status(200).json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar estatísticas." });
    }
};