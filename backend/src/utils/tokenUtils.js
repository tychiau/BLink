const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Gerar JWT token para autenticação
 * @param {Object} payload - Dados a incluir no token (ex: {id, email, tipo_usuario})
 */
const generateAuthToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verificar e descodificar JWT token
 * @param {string} token - Token a verificar
 */
const verifyAuthToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Gerar token aleatório para reset de password
 * @param {number} length - Tamanho do token (default: 32 bytes)
 */
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Gerar data de expiração
 * @param {number} hours - Horas até expirar (default: 1 hora)
 */
const generateExpirationDate = (hours = 1) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  generateRandomToken,
  generateExpirationDate
};
