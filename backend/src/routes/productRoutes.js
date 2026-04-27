const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Rotas protegidas (requerem autenticacao)
router.get('/meus-produtos', authenticateToken, productController.listMyProducts);
router.get('/meus-produtos/estatisticas', authenticateToken, productController.getVendorStats);
router.get('/produto/:id', authenticateToken, productController.getProductById);
router.post('/produtos', authenticateToken, productController.createProduct);
router.post('/test-provincia', authenticateToken, productController.testProvincia);  // CORRIGIDO: authenticateToken
router.put('/produto/:id', authenticateToken, productController.updateProduct);
router.patch('/produto/:id/status', authenticateToken, productController.updateProductStatus);
router.delete('/produto/:id', authenticateToken, productController.deleteProduct);

module.exports = router;