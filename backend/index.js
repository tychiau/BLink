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
// CONFIGURACAO CORS CORRIGIDA
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROTAS ---
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api', productRoutes);

// Rota base
app.get('/', (req, res) => {
    res.json({
        sistema: "Blink - Intermediacao de Compra e Venda",
        status: "Online",
        endpoints: {
            auth: "/auth",
            protected: "/protected",
            produtos: "/api/produtos"
        },
        timestamp: new Date().toISOString()
    });
});

// Middleware de erro 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota nao encontrada'
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

// --- INICIALIZACAO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = pool;