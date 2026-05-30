// backend/index.js - VERSÃO COMPLETA FUNCIONAL

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000', 'https://blink-oz62.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ============================================
const { verifyAuthToken } = require('./src/utils/tokenUtils');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido.' });
        }

        const decoded = verifyAuthToken(token);
        if (!decoded) {
            return res.status(403).json({ error: 'Token inválido.' });
        }

        const [users] = await pool.execute(
            'SELECT id, nome, email, tipo_usuario FROM usuarios WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(403).json({ error: 'Usuário não encontrado.' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(500).json({ error: 'Erro ao verificar autenticação.' });
    }
};

// ============================================
// ROTA DE TESTE (para verificar se o servidor está funcionando)
// ============================================
app.get('/api/teste', (req, res) => {
    res.json({ message: 'API funcionando!', timestamp: new Date().toISOString() });
});

// ============================================
// ROTA DE SOLICITAR COMPRA (VERSÃO SIMPLIFICADA PARA TESTE)
// ============================================
app.post('/api/cliente/solicitar-compra', authenticateToken, async (req, res) => {
    console.log("=== ROTA DE COMPRA ACIONADA ===");
    console.log("Body recebido:", req.body);
    console.log("Usuário:", req.user);
    
    try {
        const cliente_id = req.user.id;
        const { produto_id } = req.body;
        
        if (!produto_id) {
            return res.status(400).json({ success: false, message: "produto_id é obrigatório" });
        }
        
        // Buscar produto
        const [produto] = await pool.execute(
            'SELECT id, nome, preco_minimo, vendedor_id FROM produtos WHERE id = ?',
            [produto_id]
        );
        
        if (produto.length === 0) {
            return res.status(404).json({ success: false, message: "Produto não encontrado" });
        }
        
        const valor_final = produto[0].preco_minimo;
        const intermediario_id = produto[0].vendedor_id;
        
        // Gerar ID da venda
        const [uuidResult] = await pool.execute('SELECT UUID() as uuid');
        const vendaId = uuidResult[0].uuid;
        
        // Inserir na tabela vendas
        await pool.execute(
            `INSERT INTO vendas (id, produto_id, cliente_id, intermediario_id, valor_final, status_venda, data_venda)
             VALUES (?, ?, ?, ?, ?, 'retido', NOW())`,
            [vendaId, produto_id, cliente_id, intermediario_id, valor_final]
        );
        
        console.log("✅ Venda criada:", vendaId);
        
        res.status(201).json({ 
            success: true, 
            message: "Solicitação de compra enviada!",
            venda_id: vendaId
        });
        
    } catch (error) {
        console.error("❌ Erro:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// ROTAS EXISTENTES DO SEU SISTEMA
// ============================================

// (Aqui vão todas as suas outras rotas existentes)
app.get('/api/intermediario/perfil', authenticateToken, async (req, res) => {
    res.json({ message: "Perfil" });
});

// ============================================
// IMPORTAR ROTAS EXTERNAS
// ============================================
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const productRoutes = require('./src/routes/productRoutes');
const intermediarioRoutes = require('./src/routes/intermediarioRoutes');
const requestRoutes = require('./src/routes/requestRoutes');

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api', productRoutes);
app.use('/api/intermediario', intermediarioRoutes);
app.use('/api/requests', requestRoutes);

// ============================================
// ROTA BASE
// ============================================
app.get('/', (req, res) => {
    res.json({
        sistema: "Blink - Intermediacao de Compra e Venda",
        status: "Online",
        endpoints: {
            teste: "/api/teste",
            solicitar_compra: "POST /api/cliente/solicitar-compra"
        },
        timestamp: new Date().toISOString()
    });
});

// ============================================
// MIDDLEWARE DE ERRO 404
// ============================================
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota nao encontrada',
        path: req.originalUrl
    });
});

// ============================================
// MIDDLEWARE DE ERRO GLOBAL
// ============================================
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`📡 Rotas disponíveis:`);
    console.log(`   GET /api/teste`);
    console.log(`   POST /api/cliente/solicitar-compra`);
});

module.exports = pool;