const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const PasswordReset = require('../models/passwordResetModel');
const { generateAuthToken, generateRandomToken, generateExpirationDate } = require('../utils/tokenUtils');

/**
 * REGISTO de novo utilizador
 */
exports.register = async (req, res) => {
  try {
    const { nome, email, password, tipo_usuario } = req.body;

    // Verificar se email já existe
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return res.status(409).json({ 
        error: 'Email já está registado.' 
      });
    }

    // Hash da password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Criar utilizador
    const userId = await User.create({
      nome,
      email: email.toLowerCase(),
      password_hash,
      tipo_usuario
    });

    // Buscar utilizador criado
    const newUser = await User.getById(userId);

    // Gerar token JWT
    const token = generateAuthToken({
      id: newUser.id,
      email: newUser.email,
      tipo_usuario: newUser.tipo_usuario
    });

    res.status(201).json({
      message: 'Utilizador registado com sucesso!',
      token,
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        tipo_usuario: newUser.tipo_usuario
      }
    });

  } catch (error) {
    console.error('Erro no registo:', error);
    res.status(500).json({ 
      error: 'Erro ao registar utilizador.' 
    });
  }
};

/**
 * LOGIN de utilizador
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar utilizador por email
    const user = await User.getByEmail(email.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Email ou password incorretos.' 
      });
    }

    // Verificar password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Email ou password incorretos.' 
      });
    }

    // Atualizar último login
    await User.updateLastLogin(user.id);

    // Gerar token JWT
    const token = generateAuthToken({
      id: user.id,
      email: user.email,
      tipo_usuario: user.tipo_usuario
    });

    res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo_usuario: user.tipo_usuario
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro ao fazer login.' 
    });
  }
};

/**
 * PEDIDO de reset de password
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar utilizador
    const user = await User.getByEmail(email.toLowerCase());
    
    if (!user) {
      // Por segurança, retornar sucesso mesmo que email não exista
      return res.json({ 
        message: 'Se o email existir, receberá instruções para redefinir a password.' 
      });
    }

    // Gerar token único
    const resetToken = generateRandomToken();
    const expiresAt = generateExpirationDate(1); // Expira em 1 hora

    // Guardar token na BD
    await PasswordReset.createResetToken(user.id, resetToken, expiresAt);

    // TODO: Enviar email com o link de reset
    // Para agora, vamos apenas retornar o token (REMOVE ISTO EM PRODUÇÃO!)
    console.log(`Token de reset para ${email}: ${resetToken}`);
    console.log(`Link de reset: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);

    res.json({ 
      message: 'Se o email existir, receberá instruções para redefinir a password.',
      // REMOVE ESTAS LINHAS EM PRODUÇÃO:
      debug_token: resetToken,
      debug_link: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    });

  } catch (error) {
    console.error('Erro ao solicitar reset de password:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pedido.' 
    });
  }
};

/**
 * RESET de password (com token)
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verificar se token é válido
    const resetData = await PasswordReset.getValidToken(token);
    
    if (!resetData) {
      return res.status(400).json({ 
        error: 'Token inválido ou expirado.' 
      });
    }

    // Hash da nova password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Atualizar password
    await User.updatePassword(resetData.usuario_id, password_hash);

    // Marcar token como usado
    await PasswordReset.markAsUsed(token);

    res.json({ 
      message: 'Password redefinida com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao redefinir password:', error);
    res.status(500).json({ 
      error: 'Erro ao redefinir password.' 
    });
  }
};

/**
 * OBTER dados do utilizador autenticado
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user vem do middleware authenticateToken
    const user = await User.getById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        error: 'Utilizador não encontrado.' 
      });
    }

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
      email_verificado: user.email_verificado,
      criado_em: user.criado_em
    });

  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ 
      error: 'Erro ao obter dados do utilizador.' 
    });
  }
};
