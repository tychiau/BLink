const Product = require('../models/productModel');

exports.listProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar produtos no servidor." });
    }
};
