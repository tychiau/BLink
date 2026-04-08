const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Usamos a versão com 'promise' para facilitar o código
const fs = require('fs');
const path = require('path');
const PORT = 19672;
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = express();

app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO DA CONEXÃO COM AIVEN (MYSQL) ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  ssl: process.env.DB_SSL === 'true' || process.env.DB_SSL_MODE === 'REQUIRED' ? {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  } : false,
});

// Teste de conexão imediato
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com MySQL na Aiven estabelecida com sucesso!');
    connection.release();
  } catch (err) {
    console.error('Erro ao conectar no MySQL da Aiven:', err.message);
  }
})();
// --------------------------------------------------

app.get('/', (req, res) => {
  res.json({ message: 'API a funcionar e conectada ao MySQL!' });
});

// Exemplo de rota de teste para seu sistema de intermediação
app.get('/teste-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    res.json({ mensagem: "Banco respondendo!", query: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta 19672');
});