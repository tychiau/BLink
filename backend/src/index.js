const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse de form data

// --- ROTAS ---

// Rotas da API
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

// Rota base para verificar se a API está online
app.get('/', (req, res) => {
  res.json({
    sistema: "Blink - Intermediação de Compra e Venda",
    status: "Online",
    endpoints: {
      auth: "/auth",
      protected: "/protected"
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

// Exportamos o pool para que você possa usá-lo em outros arquivos (Controller/Routes)
module.exports = pool;