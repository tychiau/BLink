// backend/src/models/userModel.js

const db = require('../config/db');

const User = {
  /**
   * Buscar todos os utilizadores
   */
  getAll: async () => {
    const [rows] = await db.execute('SELECT id, nome, email, telefone, localizacao, tipo_usuario, status, data_criacao FROM usuarios');
    return rows;
  },

  /**
   * Buscar utilizador por ID
   */
  getById: async (id) => {
    const [rows] = await db.execute('SELECT id, nome, email, telefone, localizacao, tipo_usuario, status, foto_perfil, data_criacao FROM usuarios WHERE id = ?', [id]);
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
   */
  create: async (userData) => {
    const { nome, email, senha, tipo_usuario, telefone, localizacao } = userData;

    const [result] = await db.execute(
      'INSERT INTO usuarios (id, nome, email, senha, tipo_usuario, telefone, localizacao, status, data_criacao) VALUES (UUID(), ?, ?, ?, ?, ?, ?, "ativo", NOW())',
      [nome, email, senha, tipo_usuario, telefone || null, localizacao || null]
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
   * Verificar se email já existe
   */
  emailExists: async (email) => {
    const [rows] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    return rows.length > 0;
  },

  /**
   * Atualizar status do usuário
   */
  verifyEmail: async (userId) => {
    const [result] = await db.execute(
      'UPDATE usuarios SET status = ? WHERE id = ?',
      ['ativo', userId]
    );
    return result.affectedRows > 0;
  },

  /**
   * Atualizar último login
   */
  updateLastLogin: async (userId) => {
    return true;
  },

  // ============================================
  // MÉTODOS PARA INTERMEDIÁRIOS
  // ============================================

  /**
   * Listar todos os intermediários disponíveis (para vendedores)
   */
  listarIntermediarios: async () => {
    try {
      const [intermediarios] = await db.execute(
        `SELECT 
          id, 
          nome, 
          email, 
          telefone,
          localizacao,
          tipo_usuario,
          status,
          data_criacao
        FROM usuarios 
        WHERE tipo_usuario = 'intermediario' 
        AND status = 'ativo'
        ORDER BY nome ASC`
      );
      return intermediarios;
    } catch (error) {
      console.error('Erro ao listar intermediários:', error.message);
      throw error;
    }
  },

  /**
   * Buscar um intermediário por ID (completo)
   */
  getIntermediarioCompletoById: async (id) => {
    try {
      const [rows] = await db.execute(
        `SELECT 
          id, 
          nome, 
          email, 
          telefone,
          localizacao,
          tipo_usuario, 
          status, 
          foto_perfil,
          data_criacao
        FROM usuarios 
        WHERE id = ? AND tipo_usuario = 'intermediario' AND status = 'ativo'`,
        [id]
      );
      
      if (rows.length === 0) return null;
      
      const inter = rows[0];
      let fotoBase64 = null;
      if (inter.foto_perfil) {
        const buffer = Buffer.isBuffer(inter.foto_perfil) 
          ? inter.foto_perfil 
          : Buffer.from(inter.foto_perfil);
        fotoBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }
      
      return {
        id: inter.id,
        nome: inter.nome,
        email: inter.email || '',
        telefone: inter.telefone || '',
        localizacao: inter.localizacao || '',
        foto_perfil: fotoBase64,
        tipo_usuario: inter.tipo_usuario,
        status: inter.status,
        data_criacao: inter.data_criacao
      };
    } catch (error) {
      console.error('Erro ao buscar intermediário por ID:', error.message);
      throw error;
    }
  },

  /**
   * Buscar intermediários por termo de pesquisa (nome, email)
   */
  buscarIntermediarios: async (searchTerm) => {
    try {
      const term = `%${searchTerm}%`;
      const [intermediarios] = await db.execute(
        `SELECT 
          id, 
          nome, 
          email, 
          telefone,
          localizacao,
          tipo_usuario,
          status,
          data_criacao
        FROM usuarios 
        WHERE tipo_usuario = 'intermediario' 
        AND status = 'ativo'
        AND (nome LIKE ? OR email LIKE ?)
        ORDER BY nome ASC
        LIMIT 20`,
        [term, term]
      );
      
      return intermediarios.map(inter => ({
        id: inter.id,
        nome: inter.nome,
        email: inter.email || '',
        telefone: inter.telefone || '',
        localizacao: inter.localizacao || '',
        tipo_usuario: inter.tipo_usuario,
        status: inter.status,
        data_criacao: inter.data_criacao
      }));
    } catch (error) {
      console.error('Erro ao buscar intermediários:', error.message);
      throw error;
    }
  },

  /**
   * Verificar se uma lista de IDs são todos intermediários válidos
   */
  validarIntermediarios: async (ids) => {
    try {
      if (!ids || ids.length === 0) {
        return { validos: [], invalidos: [], todosValidos: true };
      }
      
      const placeholders = ids.map(() => '?').join(',');
      const [validos] = await db.execute(
        `SELECT id FROM usuarios 
         WHERE id IN (${placeholders}) 
         AND tipo_usuario = 'intermediario' 
         AND status = 'ativo'`,
        ids
      );
      
      const idsValidos = validos.map(v => v.id);
      const idsInvalidos = ids.filter(id => !idsValidos.includes(id));
      
      return {
        validos: idsValidos,
        invalidos: idsInvalidos,
        todosValidos: idsInvalidos.length === 0
      };
    } catch (error) {
      console.error('Erro ao validar intermediários:', error.message);
      throw error;
    }
  },

  /**
   * Atualizar perfil completo do usuário (incluindo telefone e localizacao)
   */
  atualizarPerfilCompleto: async (userId, dados) => {
    try {
      const { nome, telefone, localizacao } = dados;
      const updates = [];
      const values = [];
      
      if (nome !== undefined && nome !== null) {
        updates.push('nome = ?');
        values.push(nome);
      }
      
      if (telefone !== undefined) {
        updates.push('telefone = ?');
        values.push(telefone || null);
      }
      
      if (localizacao !== undefined) {
        updates.push('localizacao = ?');
        values.push(localizacao || null);
      }
      
      if (updates.length === 0) {
        return false;
      }
      
      values.push(userId);
      
      const [result] = await db.execute(
        `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar perfil completo:', error.message);
      throw error;
    }
  },

  /**
   * Atualizar apenas nome do usuário (simplificado)
   */
  atualizarPerfil: async (userId, dados) => {
    try {
      const { nome } = dados;
      const [result] = await db.execute(
        'UPDATE usuarios SET nome = ? WHERE id = ?',
        [nome, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error.message);
      throw error;
    }
  },

  /**
   * Atualizar foto do perfil
   */
  atualizarFotoPerfil: async (userId, fotoBuffer) => {
    try {
      const [result] = await db.execute(
        'UPDATE usuarios SET foto_perfil = ? WHERE id = ?',
        [fotoBuffer, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar foto perfil:', error.message);
      throw error;
    }
  }
};

module.exports = User;
