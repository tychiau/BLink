/**
 * Validar dados de registo
 */
const validateRegister = (req, res, next) => {
  const { nome, email, password, tipo_usuario } = req.body;
  const errors = [];

  // Validar nome
  if (!nome || nome.trim().length < 3) {
    errors.push('Nome deve ter pelo menos 3 caracteres.');
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Email inválido.');
  }

  // Validar password
  if (!password || password.length < 6) {
    errors.push('Password deve ter pelo menos 6 caracteres.');
  }

  // Validar tipo de utilizador
  const allowedTypes = ['cliente', 'intermediario', 'vendedor'];
  if (!tipo_usuario || !allowedTypes.includes(tipo_usuario)) {
    errors.push('Tipo de utilizador inválido. Use: cliente, intermediario ou vendedor.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Validar dados de login
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email é obrigatório.');
  }

  if (!password) {
    errors.push('Password é obrigatória.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Validar pedido de reset de password
 */
const validatePasswordResetRequest = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      error: 'Email é obrigatório.' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Email inválido.' 
    });
  }

  next();
};

/**
 * Validar reset de password
 */
const validatePasswordReset = (req, res, next) => {
  const { token, newPassword } = req.body;
  const errors = [];

  if (!token) {
    errors.push('Token é obrigatório.');
  }

  if (!newPassword || newPassword.length < 6) {
    errors.push('Nova password deve ter pelo menos 6 caracteres.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset
};
