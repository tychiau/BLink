const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Rotas protegidas (requerem autenticação)
router.get('/meus-produtos', authenticateToken, productController.listMyProducts);
router.get('/meus-produtos/estatisticas', authenticateToken, productController.getVendorStats);
router.get('/produto/:id', authenticateToken, productController.getProductById);
router.post('/produtos', authenticateToken, productController.createProduct);
router.put('/produto/:id', authenticateToken, productController.updateProduct);
router.patch('/produto/:id/status', authenticateToken, productController.updateProductStatus);
router.delete('/produto/:id', authenticateToken, productController.deleteProduct);

// Rota pública (opcional - para listar produtos publicados)
router.get('/produtos', productController.listMyProducts); // Ajustar conforme necessidade

module.exports = router;