const { verifyAuthToken } = require('../utils/tokenUtils');
const User = require('../models/userModel');

/**
 * Middleware para verificar se o utilizador está autenticado
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Obter token do header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ 
        error: 'Acesso negado. Token não fornecido.' 
      });
    }

    // Verificar token
    const decoded = verifyAuthToken(token);
    
    if (!decoded) {
      return res.status(403).json({ 
        error: 'Token inválido ou expirado.' 
      });
    }

    // Buscar utilizador na BD para garantir que ainda existe
    const user = await User.getById(decoded.id);
    
    if (!user) {
      return res.status(403).json({ 
        error: 'Utilizador não encontrado.' 
      });
    }

    // Adicionar dados do utilizador ao request
    req.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario
    };

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ 
      error: 'Erro ao verificar autenticação.' 
    });
  }
};

/**
 * Middleware para verificar tipo de utilizador
 * @param {...string} allowedTypes - Tipos permitidos (ex: 'cliente', 'intermediario', 'vendedor')
 */
const authorizeRole = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Utilizador não autenticado.' 
      });
    }

    if (!allowedTypes.includes(req.user.tipo_usuario)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Permissões insuficientes.' 
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};
