const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define a rota GET para listar produtos
router.get('/produtos', productController.listProducts);

module.exports = router;