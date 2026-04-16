const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db');

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Alterei para '*' caso o .env não tenha a URL, para evitar bloqueio no teste
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROTAS ---

// Rotas da API
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api', productRoutes);

// Rota base atualizada para mostrar o novo endpoint
app.get('/', (req, res) => {
  res.json({
    sistema: "Blink - Intermediação de Compra e Venda",
    status: "Online",
    endpoints: {
      auth: "/auth",
      protected: "/protected",
      produtos: "/api/produtos" // <--- Adicionei aqui para você ver no navegador
    },
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada'
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = pool;
