const db = require('../config/db');

const User = {
  /**
   * Buscar todos os utilizadores
   */
  getAll: async () => {
    const [rows] = await db.execute('SELECT id, nome, email, tipo_usuario, data_criacao FROM usuarios');
    return rows;
  },

  /**
   * Buscar utilizador por ID
   */
  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  },

  /**
   * Buscar utilizador por email (para login e verificações)
   */
  getByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  },

  /**
   * Criar novo utilizador (REGISTO)
   * @param {Object} userData - {nome, email, senha, tipo_usuario}
   */
  create: async (userData) => {
    const { nome, email, senha, tipo_usuario } = userData;

    // Using status 'Ativo' as default instead of email_verificado
    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha, tipo_usuario, status, data_criacao) VALUES (?, ?, ?, ?, ?, NOW())',
      [nome, email, senha, tipo_usuario, 'Ativo']
    );

    return result.insertId;
  },

  /**
   * Atualizar password do utilizador
   */
  updatePassword: async (userId, newPasswordHash) => {
    const [result] = await db.execute(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [newPasswordHash, userId]
    );

    return result.affectedRows > 0;
  },

  /**
   * Verificar se email já existe (para evitar duplicados no registo)
   */
  emailExists: async (email) => {
    const [rows] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    return rows.length > 0;
  },

  /**
   * Marcar email como verificado
   */
  verifyEmail: async (userId) => {
    const [result] = await db.execute(
      'UPDATE usuarios SET status = ? WHERE id = ?',
      ['Ativo', userId] // Mapeamos para status, já que email_verificado não existe na tabela
    );

    return result.affectedRows > 0;
  },

  /**
   * Atualizar último login
   */
  updateLastLogin: async (userId) => {
    // Tabela usuarios não tem coluna ultimo_login
    // await db.execute('UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?', [userId]);
  }
};

module.exports = User;
