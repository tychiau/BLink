// backend/index.js (VERSÃO COMPLETA COM ROTAS DE PERFIL DIRETAS)

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('./src/config/db');

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const productRoutes = require('./src/routes/productRoutes');
const intermediarioRoutes = require('./src/routes/intermediarioRoutes');
const requestRoutes = require('./src/routes/requestRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000', 'https://blink-oz62.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// MIDDLEWARE DE AUTENTICAÇÃO (cópia local)
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
// ROTAS DE PERFIL DO INTERMEDIÁRIO (DIRETAS)
// ============================================

// GET /api/intermediario/perfil - Buscar perfil
app.get('/api/intermediario/perfil', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [rows] = await pool.execute(
            `SELECT id, nome, email, telefone, localizacao, status, tipo_usuario, foto_perfil, data_criacao
             FROM usuarios WHERE id = ? AND tipo_usuario = 'intermediario'`,
            [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: true, message: 'Perfil não encontrado' });
        }
        
        const usuario = rows[0];
        let fotoBase64 = null;
        
        if (usuario.foto_perfil) {
            const buffer = Buffer.isBuffer(usuario.foto_perfil) ? usuario.foto_perfil : Buffer.from(usuario.foto_perfil);
            fotoBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        }
        
        res.json({
            success: true,
            data: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone || '',
                localizacao: usuario.localizacao || '',
                foto_perfil: fotoBase64,
                data_criacao: usuario.data_criacao,
                status: usuario.status,
                tipo_usuario: usuario.tipo_usuario
            }
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: true, message: 'Erro ao buscar perfil' });
    }
});

// PUT /api/intermediario/perfil - Atualizar perfil
app.put('/api/intermediario/perfil', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { nome, email, telefone, localizacao } = req.body;
        
        console.log('Atualizando perfil:', { userId, nome, email, telefone, localizacao });
        
        if (!nome || !email) {
            return res.status(400).json({ error: true, message: 'Nome e email são obrigatórios' });
        }
        
        // Verificar se email já existe
        const [existing] = await pool.execute(
            'SELECT id FROM usuarios WHERE email = ? AND id != ?',
            [email.trim(), userId]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: true, message: 'Email já está em uso' });
        }
        
        await pool.execute(
            `UPDATE usuarios SET nome = ?, email = ?, telefone = ?, localizacao = ? 
             WHERE id = ? AND tipo_usuario = 'intermediario'`,
            [nome.trim(), email.trim(), telefone || null, localizacao || null, userId]
        );
        
        const [updated] = await pool.execute(
            `SELECT id, nome, email, telefone, localizacao, data_criacao, status, tipo_usuario 
             FROM usuarios WHERE id = ?`,
            [userId]
        );
        
        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso',
            data: updated[0]
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: true, message: 'Erro ao atualizar perfil' });
    }
});

// PUT /api/intermediario/perfil/foto - Atualizar foto
app.put('/api/intermediario/perfil/foto', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { foto_base64 } = req.body;
        
        if (!foto_base64) {
            return res.status(400).json({ error: true, message: 'Foto não fornecida' });
        }
        
        let base64Data = foto_base64;
        if (foto_base64.includes(',')) {
            base64Data = foto_base64.split(',')[1];
        }
        
        const fotoBuffer = Buffer.from(base64Data, 'base64');
        
        await pool.execute(
            'UPDATE usuarios SET foto_perfil = ? WHERE id = ?',
            [fotoBuffer, userId]
        );
        
        res.json({ success: true, message: 'Foto atualizada com sucesso' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: true, message: 'Erro ao atualizar foto' });
    }
});

// PUT /api/intermediario/alterar-senha - Alterar senha
app.put('/api/intermediario/alterar-senha', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { senha_antiga, nova_senha, confirmar_senha } = req.body;
        
        if (!senha_antiga || !nova_senha || !confirmar_senha) {
            return res.status(400).json({ error: true, message: 'Todos os campos são obrigatórios' });
        }
        
        if (nova_senha.length < 6) {
            return res.status(400).json({ error: true, message: 'Senha deve ter pelo menos 6 caracteres' });
        }
        
        if (nova_senha !== confirmar_senha) {
            return res.status(400).json({ error: true, message: 'Senhas não coincidem' });
        }
        
        const [rows] = await pool.execute(
            'SELECT senha FROM usuarios WHERE id = ?',
            [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: true, message: 'Usuário não encontrado' });
        }
        
        const senhaValida = await bcrypt.compare(senha_antiga, rows[0].senha);
        
        if (!senhaValida) {
            return res.status(401).json({ error: true, message: 'Senha atual incorreta' });
        }
        
        const novaSenhaHash = await bcrypt.hash(nova_senha, 10);
        
        await pool.execute(
            'UPDATE usuarios SET senha = ? WHERE id = ?',
            [novaSenhaHash, userId]
        );
        
        res.json({ success: true, message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: true, message: 'Erro ao alterar senha' });
    }
});

// GET /api/intermediario/listar - Rota pública
app.get('/api/intermediario/listar', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT id, nome, email, telefone, localizacao, tipo_usuario, status, data_criacao
             FROM usuarios WHERE tipo_usuario = 'intermediario' AND status = 'ativo'
             ORDER BY nome ASC`
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: true, message: 'Erro ao listar intermediários' });
    }
});

// GET /api/intermediario/stats - Estatísticas
app.get('/api/intermediario/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [produtos] = await pool.execute(
            `SELECT COUNT(*) as total FROM solicitacoes_intermediacao 
             WHERE intermediario_id = ? AND status = 'aceite'`,
            [userId]
        );
        
        const [vendas] = await pool.execute(
            `SELECT COUNT(*) as total FROM vendas WHERE intermediario_id = ?`,
            [userId]
        );
        
        const [pendentes] = await pool.execute(
            `SELECT COUNT(*) as total FROM solicitacoes_intermediacao 
             WHERE intermediario_id = ? AND status = 'pendente'`,
            [userId]
        );
        
        res.json({
            produtos_ativos: produtos[0].total,
            vendas_realizadas: vendas[0].total,
            aprovacoes_pendentes: pendentes[0].total,
            comissao_mes: 0,
            taxa_conversao: 0
        });
    } catch (error) {
        console.error('Erro:', error);
        res.json({
            produtos_ativos: 0,
            vendas_realizadas: 0,
            aprovacoes_pendentes: 0,
            comissao_mes: 0,
            taxa_conversao: 0
        });
    }
});

// GET /api/intermediario/oportunidades - Oportunidades
app.get('/api/intermediario/oportunidades', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [rows] = await pool.execute(
            `SELECT p.id, p.nome, p.preco_minimo, p.comissao_intermediario, p.foto_produto,
                    c.nome as categoria_nome, p.provincia, u.nome as vendedor_nome
             FROM produtos p
             LEFT JOIN categorias c ON c.id = p.categoria_id
             LEFT JOIN usuarios u ON u.id = p.vendedor_id
             WHERE p.estado = 'publicado'
             AND p.id NOT IN (
                 SELECT produto_id FROM solicitacoes_intermediacao 
                 WHERE intermediario_id = ? AND status IN ('pendente', 'aceite')
             )
             LIMIT 20`,
            [userId]
        );
        
        const produtos = rows.map(p => {
            let foto_url = null;
            if (p.foto_produto && Buffer.isBuffer(p.foto_produto)) {
                foto_url = `data:image/jpeg;base64,${p.foto_produto.toString('base64')}`;
            }
            return {
                id: p.id,
                nome: p.nome,
                preco_minimo: parseFloat(p.preco_minimo),
                comissao_intermediario: parseFloat(p.comissao_intermediario || 5),
                foto_url,
                categoria_nome: p.categoria_nome,
                provincia: p.provincia,
                vendedor_nome: p.vendedor_nome
            };
        });
        
        res.json(produtos);
    } catch (error) {
        console.error('Erro:', error);
        res.json([]);
    }
});

// ============================================
// ROTAS EXISTENTES
// ============================================
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api', productRoutes);
app.use('/api/intermediario-old', intermediarioRoutes);
app.use('/api/requests', requestRoutes);

// Rota base
app.get('/', (req, res) => {
    res.json({
        sistema: "Blink - Intermediacao de Compra e Venda",
        status: "Online",
        endpoints: {
            auth: "/auth",
            perfil: "/api/intermediario/perfil",
            listar: "/api/intermediario/listar",
            stats: "/api/intermediario/stats"
        },
        timestamp: new Date().toISOString()
    });
});

// Middleware de erro 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota nao encontrada',
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Rotas disponíveis:`);
    console.log(`  - GET /api/intermediario/perfil`);
    console.log(`  - PUT /api/intermediario/perfil`);
    console.log(`  - PUT /api/intermediario/perfil/foto`);
    console.log(`  - PUT /api/intermediario/alterar-senha`);
    console.log(`  - GET /api/intermediario/listar`);
    console.log(`  - GET /api/intermediario/stats`);
    console.log(`  - GET /api/intermediario/oportunidades`);
});

module.exports = pool;