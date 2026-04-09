const db = require('../config/db');

const User = {
  /**
   * Buscar todos os utilizadores
   */
  getAll: async () => {
    const [rows] = await db.execute('SELECT id, nome, email, tipo_usuario, criado_em FROM usuarios');
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
   * @param {Object} userData - {nome, email, password_hash, tipo_usuario}
   */
  create: async (userData) => {
    const { nome, email, password_hash, tipo_usuario } = userData;
    
    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, email, password_hash, tipo_usuario, email_verificado, criado_em) VALUES (?, ?, ?, ?, false, NOW())',
      [nome, email, password_hash, tipo_usuario]
    );
    
    return result.insertId;
  },

  /**
   * Atualizar password do utilizador
   */
  updatePassword: async (userId, newPasswordHash) => {
    const [result] = await db.execute(
      'UPDATE usuarios SET password_hash = ?, atualizado_em = NOW() WHERE id = ?',
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
      'UPDATE usuarios SET email_verificado = true, atualizado_em = NOW() WHERE id = ?',
      [userId]
    );
    
    return result.affectedRows > 0;
  },

  /**
   * Atualizar último login
   */
  updateLastLogin: async (userId) => {
    await db.execute(
      'UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?',
      [userId]
    );
  }
};

module.exports = User;
