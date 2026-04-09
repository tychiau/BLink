const db = require('../config/db');

const PasswordReset = {
  /**
   * Criar um token de reset de password
   * @param {number} userId - ID do utilizador
   * @param {string} token - Token único gerado
   * @param {Date} expiresAt - Data de expiração do token
   */
  createResetToken: async (userId, token, expiresAt) => {
    // Invalidar tokens anteriores deste utilizador
    await db.execute(
      'UPDATE password_resets SET usado = true WHERE usuario_id = ? AND usado = false',
      [userId]
    );

    // Criar novo token
    const [result] = await db.execute(
      'INSERT INTO password_resets (usuario_id, token, expira_em, criado_em) VALUES (?, ?, ?, NOW())',
      [userId, token, expiresAt]
    );
    
    return result.insertId;
  },

  /**
   * Buscar token válido
   * @param {string} token - Token a verificar
   */
  getValidToken: async (token) => {
    const [rows] = await db.execute(
      `SELECT pr.*, u.email, u.nome 
       FROM password_resets pr
       INNER JOIN usuarios u ON pr.usuario_id = u.id
       WHERE pr.token = ? 
       AND pr.usado = false 
       AND pr.expira_em > NOW()`,
      [token]
    );
    
    return rows[0];
  },

  /**
   * Marcar token como usado
   */
  markAsUsed: async (token) => {
    const [result] = await db.execute(
      'UPDATE password_resets SET usado = true WHERE token = ?',
      [token]
    );
    
    return result.affectedRows > 0;
  },

  /**
   * Limpar tokens expirados (manutenção da BD)
   */
  cleanExpiredTokens: async () => {
    const [result] = await db.execute(
      'DELETE FROM password_resets WHERE expira_em < NOW()'
    );
    
    return result.affectedRows;
  }
};

module.exports = PasswordReset;
