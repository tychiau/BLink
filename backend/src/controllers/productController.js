const Product = require('../models/productModel');

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
        console.log("Body recebido:", req.body);
        
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
        
        console.log("Vendedor ID:", vendedor_id);
        
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
            foto_produto: foto_produto || null
        });
        
        console.log("Produto criado com ID:", productId);
        
        const newProduct = await Product.getById(productId);
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

// Atualizar produto - MODIFICADO
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