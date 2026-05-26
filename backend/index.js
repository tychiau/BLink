// backend/index.js - VERSÃO COMPLETA E CORRIGIDA

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
// ROTAS DE PERFIL DO INTERMEDIÁRIO
// ============================================

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

app.put('/api/intermediario/perfil', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { nome, email, telefone, localizacao } = req.body;
        
        if (!nome || !email) {
            return res.status(400).json({ error: true, message: 'Nome e email são obrigatórios' });
        }
        
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

// ============================================
// ROTAS DO DASHBOARD DO INTERMEDIÁRIO
// ============================================

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
             ORDER BY p.data_cadastro DESC
             LIMIT 50`,
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

app.get('/api/intermediario/produtos-ativos', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [rows] = await pool.execute(
            `SELECT 
                p.id, 
                p.nome, 
                p.preco_minimo, 
                p.comissao_intermediario,
                p.foto_produto,
                si.status,
                DATE_FORMAT(si.data_solicitacao, '%Y-%m-%d') as data_vinculo,
                u.nome as vendedor_nome
             FROM solicitacoes_intermediacao si
             INNER JOIN produtos p ON p.id = si.produto_id
             LEFT JOIN usuarios u ON u.id = p.vendedor_id
             WHERE si.intermediario_id = ? AND si.status = 'aceite'
             ORDER BY si.data_solicitacao DESC`,
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
                comissao_valor: (parseFloat(p.preco_minimo) * parseFloat(p.comissao_intermediario || 5)) / 100,
                foto_url,
                vendedor_nome: p.vendedor_nome,
                status: p.status,
                data_vinculo: p.data_vinculo
            };
        });
        
        res.json(produtos);
    } catch (error) {
        console.error('Erro em produtos-ativos:', error);
        res.json([]);
    }
});

app.get('/api/intermediario/meus-produtos-ativos', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [rows] = await pool.execute(
            `SELECT 
                p.id, 
                p.nome, 
                p.preco_minimo, 
                p.comissao_intermediario,
                p.foto_produto,
                si.status
             FROM solicitacoes_intermediacao si
             INNER JOIN produtos p ON p.id = si.produto_id
             WHERE si.intermediario_id = ? AND si.status = 'aceite'
             ORDER BY si.data_solicitacao DESC`,
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
                comissao_valor: (parseFloat(p.preco_minimo) * parseFloat(p.comissao_intermediario || 5)) / 100,
                foto_url,
                status: p.status
            };
        });
        
        res.json(produtos);
    } catch (error) {
        console.error('Erro em meus-produtos-ativos:', error);
        res.json([]);
    }
});

app.get('/api/intermediario/aprovacoes-pendentes', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [rows] = await pool.execute(
            `SELECT 
                si.id as solicitacao_id,
                si.status,
                DATE_FORMAT(si.data_solicitacao, '%Y-%m-%d') as data_solicitacao,
                p.id as produto_id,
                p.nome as produto_nome,
                p.preco_minimo,
                p.comissao_intermediario,
                p.foto_produto,
                u.nome as vendedor_nome,
                u.id as vendedor_id
             FROM solicitacoes_intermediacao si
             INNER JOIN produtos p ON p.id = si.produto_id
             LEFT JOIN usuarios u ON u.id = p.vendedor_id
             WHERE si.intermediario_id = ? AND si.status = 'pendente'
             ORDER BY si.data_solicitacao DESC`,
            [userId]
        );
        
        const solicitacoes = rows.map(s => {
            let foto_url = null;
            if (s.foto_produto && Buffer.isBuffer(s.foto_produto)) {
                foto_url = `data:image/jpeg;base64,${s.foto_produto.toString('base64')}`;
            }
            return {
                id: s.solicitacao_id,
                produto_id: s.produto_id,
                produto_nome: s.produto_nome,
                vendedor_nome: s.vendedor_nome,
                foto_url: foto_url,
                data_solicitacao: s.data_solicitacao,
                status: s.status
            };
        });
        
        res.json(solicitacoes);
    } catch (error) {
        console.error('Erro em aprovacoes-pendentes:', error);
        res.json([]);
    }
});

app.post('/api/intermediario/solicitar/:produtoId', authenticateToken, async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const { produtoId } = req.params;
        
        const [produto] = await pool.execute(
            `SELECT id, vendedor_id, nome, estado FROM produtos WHERE id = ? AND estado = 'publicado'`,
            [produtoId]
        );
        
        if (produto.length === 0) {
            return res.status(404).json({ success: false, message: 'Produto não encontrado ou indisponível' });
        }
        
        const [existente] = await pool.execute(
            `SELECT id, status FROM solicitacoes_intermediacao 
             WHERE intermediario_id = ? AND produto_id = ? AND status IN ('pendente', 'aceite')`,
            [intermediarioId, produtoId]
        );
        
        if (existente.length > 0) {
            return res.status(409).json({ success: false, message: `Já existe solicitação ${existente[0].status}` });
        }
        
        const [uuidResult] = await pool.execute('SELECT UUID() as uuid');
        const solicitacaoId = uuidResult[0].uuid;
        
        await pool.execute(
            `INSERT INTO solicitacoes_intermediacao (id, produto_id, intermediario_id, vendedor_id, status, data_solicitacao)
             VALUES (?, ?, ?, ?, 'pendente', NOW())`,
            [solicitacaoId, produtoId, intermediarioId, produto[0].vendedor_id]
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'Solicitação enviada com sucesso!',
            data: { solicitacao_id: solicitacaoId }
        });
        
    } catch (error) {
        console.error('Erro ao solicitar:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar solicitação' });
    }
});

app.delete('/api/intermediario/solicitacao/:solicitacaoId', authenticateToken, async (req, res) => {
    try {
        const intermediarioId = req.user.id;
        const { solicitacaoId } = req.params;
        
        const [result] = await pool.execute(
            `DELETE FROM solicitacoes_intermediacao 
             WHERE id = ? AND intermediario_id = ? AND status = 'pendente'`,
            [solicitacaoId, intermediarioId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Solicitação não encontrada' });
        }
        
        res.json({ message: 'Solicitação cancelada com sucesso' });
        
    } catch (error) {
        console.error('Erro ao cancelar:', error);
        res.status(500).json({ message: 'Erro ao cancelar solicitação' });
    }
});

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

// ============================================
// ROTAS DE COMPRA DO CLIENTE
// ============================================

// Cliente solicita compra (adiciona no carrinho) - VERSÃO CORRIGIDA
app.post('/api/cliente/solicitar-compra', authenticateToken, async (req, res) => {
    try {
        const cliente_id = req.user.id;
        const { produto_id, intermediario_id, valor_final } = req.body;
        
        console.log("=== SOLICITAÇÃO DE COMPRA ===");
        console.log("Cliente ID:", cliente_id);
        console.log("Produto ID:", produto_id);
        console.log("Intermediário ID:", intermediario_id);
        console.log("Valor:", valor_final);
        
        // VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
        if (!produto_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Campo 'produto_id' é obrigatório" 
            });
        }
        
        if (!intermediario_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Campo 'intermediario_id' é obrigatório" 
            });
        }
        
        if (!valor_final || valor_final <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Campo 'valor_final' deve ser um valor positivo" 
            });
        }
        
        // Verificar se o cliente existe (CORRIGIDO: usando cliente_id)
        const [cliente] = await pool.execute(
            'SELECT id, nome FROM usuarios WHERE id = ? AND tipo_usuario = "cliente"',
            [cliente_id]
        );
        
        if (cliente.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Cliente não encontrado" 
            });
        }
        
        // Verificar se o intermediário existe
        const [intermediario] = await pool.execute(
            'SELECT id, nome FROM usuarios WHERE id = ? AND tipo_usuario = "intermediario"',
            [intermediario_id]
        );
        
        if (intermediario.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Intermediário não encontrado" 
            });
        }
        
        // Verificar se o produto existe e está publicado
        const [produto] = await pool.execute(
            'SELECT id, nome, preco_minimo FROM produtos WHERE id = ? AND estado = "publicado"',
            [produto_id]
        );
        
        if (produto.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Produto não encontrado ou indisponível" 
            });
        }
        
        // Verificar se já existe solicitação pendente para este produto (CORRIGIDO: usando cliente_id)
        const [existente] = await pool.execute(
            `SELECT id FROM vendas 
             WHERE cliente_id = ? AND produto_id = ? AND status_venda = 'retido'`,
            [cliente_id, produto_id]
        );
        
        if (existente.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: "Você já possui uma solicitação pendente para este produto" 
            });
        }
        
        // Gerar ID único para a venda
        const [uuidResult] = await pool.execute('SELECT UUID() as uuid');
        const vendaId = uuidResult[0].uuid;
        
        // Inserir na tabela vendas (CORRIGIDO: usando cliente_id, intermediario_id)
        await pool.execute(
            `INSERT INTO vendas (id, produto_id, cliente_id, intermediario_id, valor_final, status_venda, data_venda)
             VALUES (?, ?, ?, ?, ?, 'retido', NOW())`,
            [vendaId, produto_id, cliente_id, intermediario_id, valor_final]
        );
        
        console.log(`Venda criada com sucesso. ID: ${vendaId}`);
        
        res.status(201).json({ 
            success: true, 
            message: "Solicitação de compra enviada ao intermediário!",
            venda_id: vendaId
        });
        
    } catch (error) {
        console.error('Erro ao solicitar compra:', error);
        res.status(500).json({ 
            success: false, 
            message: "Erro interno do servidor: " + error.message 
        });
    }
});

// 2. Cliente busca suas solicitações (carrinho)
app.get('/api/cliente/minhas-solicitacoes', authenticateToken, async (req, res) => {
    try {
        const cliente_id = req.user.id;
        
        const [rows] = await pool.execute(
            `SELECT 
                v.id,
                v.produto_id,
                v.valor_final,
                v.status_venda,
                v.data_venda,
                p.nome as produto_nome,
                p.foto_prodoto,
                u.nome as intermediario_nome
             FROM vendas v
             INNER JOIN produtos p ON v.produto_id = p.id
             INNER JOIN usuarios u ON v.intermediario_id = u.id
             WHERE v.cliente_id = ? AND v.status_venda = 'retido'
             ORDER BY v.data_venda DESC`,
            [cliente_id]
        );
        
        const solicitacoes = rows.map(v => {
            let fotoProduto = null;
            if (v.foto_produto && Buffer.isBuffer(v.foto_produto)) {
                fotoProduto = `data:image/jpeg;base64,${v.foto_produto.toString('base64')}`;
            }
            
            return {
                id: v.id,
                produto_id: v.produto_id,
                produto_nome: v.produto_nome,
                valor: parseFloat(v.valor_final),
                valor_formatado: `${parseFloat(v.valor_final).toLocaleString()} MZN`,
                status: v.status_venda,
                intermediario_nome: v.intermediario_nome,
                foto_produto: fotoProduto || "https://placehold.co/80x80/1e3a5f/ffffff?text=P",
                data_solicitacao: v.data_venda
            };
        });
        
        res.json(solicitacoes);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ message: error.message });
    }
});

// 3. Cliente cancela solicitação
app.delete('/api/cliente/cancelar-solicitacao/:solicitacaoId', authenticateToken, async (req, res) => {
    const { solicitacaoId } = req.params;
    const cliente_id = req.user.id;
    
    try {
        const [result] = await pool.execute(
            `DELETE FROM vendas 
             WHERE id = ? AND cliente_id = ? AND status_venda = 'retido'`,
            [solicitacaoId, cliente_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Solicitação não encontrada" 
            });
        }
        
        res.json({ 
            success: true, 
            message: "Solicitação cancelada com sucesso" 
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Intermediário busca solicitações de compra pendentes
app.get('/api/intermediario/solicitacoes-compra', authenticateToken, async (req, res) => {
    try {
        const intermediario_id = req.user.id;
        
        const [rows] = await pool.execute(
            `SELECT 
                v.id,
                v.produto_id,
                v.valor_final,
                v.status_venda,
                v.data_venda,
                p.nome as produto_nome,
                p.foto_produto,
                u.nome as cliente_nome,
                u.email as cliente_email,
                u.telefone as cliente_telefone
             FROM vendas v
             INNER JOIN produtos p ON v.produto_id = p.id
             INNER JOIN usuarios u ON v.cliente_id = u.id
             WHERE v.intermediario_id = ? AND v.status_venda = 'retido'
             ORDER BY v.data_venda DESC`,
            [intermediario_id]
        );
        
        const solicitacoes = rows.map(v => {
            let fotoProduto = null;
            if (v.foto_produto && Buffer.isBuffer(v.foto_produto)) {
                fotoProduto = `data:image/jpeg;base64,${v.foto_produto.toString('base64')}`;
            }
            
            return {
                id: v.id,
                produto_id: v.produto_id,
                produto_nome: v.produto_nome,
                cliente_id: v.cliente_id,
                cliente_nome: v.cliente_nome,
                cliente_email: v.cliente_email || '',
                cliente_telefone: v.cliente_telefone || '',
                valor: parseFloat(v.valor_final),
                foto_produto: fotoProduto || "https://placehold.co/60x60/1e3a5f/ffffff?text=P",
                data_solicitacao: v.data_venda,
                status: v.status_venda
            };
        });
        
        res.json(solicitacoes);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ message: error.message });
    }
});

// Intermediário aprova solicitação de compra
app.post('/api/intermediario/solicitacoes-compra/:solicitacaoId/aprovar', authenticateToken, async (req, res) => {
    const { solicitacaoId } = req.params;
    const intermediario_id = req.user.id;
    
    try {
        const [solicitacao] = await pool.execute(
            `SELECT id FROM vendas 
             WHERE id = ? AND intermediario_id = ? AND status_venda = 'retido'`,
            [solicitacaoId, intermediario_id]
        );
        
        if (solicitacao.length === 0) {
            return res.status(404).json({ success: false, message: "Solicitação não encontrada" });
        }
        
        // Status permanece 'retido' - apenas registramos a aprovação
        await pool.execute(
            `UPDATE vendas SET data_aprovacao = NOW() WHERE id = ?`,
            [solicitacaoId]
        );
        
        res.json({ success: true, message: "Compra aprovada com sucesso!" });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Intermediário rejeita solicitação de compra
app.post('/api/intermediario/solicitacoes-compra/:solicitacaoId/rejeitar', authenticateToken, async (req, res) => {
    const { solicitacaoId } = req.params;
    const intermediario_id = req.user.id;
    
    try {
        const [solicitacao] = await pool.execute(
            `SELECT id FROM vendas 
             WHERE id = ? AND intermediario_id = ? AND status_venda = 'retido'`,
            [solicitacaoId, intermediario_id]
        );
        
        if (solicitacao.length === 0) {
            return res.status(404).json({ success: false, message: "Solicitação não encontrada" });
        }
        
        // Mudar status para 'estornado' (rejeitado)
        await pool.execute(
            `UPDATE vendas SET status_venda = 'estornado' WHERE id = ?`,
            [solicitacaoId]
        );
        
        res.json({ success: true, message: "Compra rejeitada" });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// IMPORTAR ROTAS (MÓDULOS EXTERNOS)
// ============================================
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const productRoutes = require('./src/routes/productRoutes');
const requestRoutes = require('./src/routes/requestRoutes');

// ============================================
// USAR ROTAS (MÓDULOS EXTERNOS)
// ============================================
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api', productRoutes);
app.use('/api/requests', requestRoutes);

// ============================================
// ROTA BASE
// ============================================
app.get('/', (req, res) => {
    res.json({
        sistema: "Blink - Intermediacao de Compra e Venda",
        status: "Online",
        endpoints: {
            auth: "/auth",
            perfil: "/api/intermediario/perfil",
            listar: "/api/intermediario/listar",
            solicitar_compra: "POST /api/cliente/solicitar-compra",
            minhas_solicitacoes: "GET /api/cliente/minhas-solicitacoes",
            cancelar_solicitacao: "DELETE /api/cliente/cancelar-solicitacao/:id",
            solicitacoes_compra: "GET /api/intermediario/solicitacoes-compra",
            aprovar_compra: "POST /api/intermediario/solicitacoes-compra/:id/aprovar",
            rejeitar_compra: "POST /api/intermediario/solicitacoes-compra/:id/rejeitar"
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
    console.log(`📡 Rotas de compra disponíveis:`);
    console.log(`   POST /api/cliente/solicitar-compra`);
    console.log(`   GET /api/cliente/minhas-solicitacoes`);
    console.log(`   DELETE /api/cliente/cancelar-solicitacao/:id`);
    console.log(`   GET /api/intermediario/solicitacoes-compra`);
    console.log(`   POST /api/intermediario/solicitacoes-compra/:id/aprovar`);
    console.log(`   POST /api/intermediario/solicitacoes-compra/:id/rejeitar`);
});


module.exports = pool;