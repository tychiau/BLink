// frontend/src/components/PerfilIntermediario.jsx
import React, { useState, useEffect } from 'react';
import { intermediarioAPI } from '../../api';
import './PerfilIntermediario.css';

const PerfilIntermediario = ({ perfilData, onClose, onLogout, onPerfilAtualizado }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [perfil, setPerfil] = useState({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    localizacao: '',
    foto_perfil: null,
    data_criacao: ''
  });
  const [editData, setEditData] = useState({
    nome: '',
    email: '',
    telefone: '',
    localizacao: ''
  });
  const [senhaData, setSenhaData] = useState({
    senha_antiga: '',
    nova_senha: '',
    confirmar_senha: ''
  });

  useEffect(() => {
    if (perfilData) {
      setPerfil({
        id: perfilData.id || '',
        nome: perfilData.nome || '',
        email: perfilData.email || '',
        telefone: perfilData.telefone || '',
        localizacao: perfilData.localizacao || '',
        foto_perfil: perfilData.foto_perfil || null,
        data_criacao: perfilData.criado_em || perfilData.data_criacao || new Date().toISOString()
      });
      
      setEditData({
        nome: perfilData.nome || '',
        email: perfilData.email || '',
        telefone: perfilData.telefone || '',
        localizacao: perfilData.localizacao || ''
      });
    }
  }, [perfilData]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const getToken = () => localStorage.getItem('accessToken');

  const formatarData = (data) => {
    if (!data) return '2026';
    return new Date(data).toLocaleDateString('pt-MZ', { year: 'numeric', month: 'long' });
  };

  const handleEditClick = () => {
    setEditData({
      nome: perfil.nome,
      email: perfil.email,
      telefone: perfil.telefone,
      localizacao: perfil.localizacao
    });
    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const handleChangePasswordClick = () => {
    setSenhaData({
      senha_antiga: '',
      nova_senha: '',
      confirmar_senha: ''
    });
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  const handleSavePerfil = async () => {
    if (!editData.nome || editData.nome.trim() === '') {
      showToast('O nome é obrigatório', 'error');
      return;
    }

    if (!editData.email || editData.email.trim() === '') {
      showToast('O email é obrigatório', 'error');
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const response = await intermediarioAPI.updatePerfil(token, {
        nome: editData.nome.trim(),
        email: editData.email.trim(),
        telefone: editData.telefone || '',
        localizacao: editData.localizacao || ''
      });

      if (response && !response.error && response.success) {
        const updatedPerfil = {
          ...perfil,
          nome: editData.nome.trim(),
          email: editData.email.trim(),
          telefone: editData.telefone || '',
          localizacao: editData.localizacao || ''
        };
        
        setPerfil(updatedPerfil);
        setIsEditing(false);
        showToast('Perfil atualizado com sucesso!', 'success');
        
        if (onPerfilAtualizado) {
          onPerfilAtualizado({
            nome: editData.nome.trim(),
            email: editData.email.trim(),
            telefone: editData.telefone || '',
            localizacao: editData.localizacao || ''
          });
        }
        
        const usuarioData = localStorage.getItem('blink_user');
        if (usuarioData) {
          const usuario = JSON.parse(usuarioData);
          usuario.nome = editData.nome.trim();
          usuario.email = editData.email.trim();
          usuario.telefone = editData.telefone || '';
          usuario.localizacao = editData.localizacao || '';
          localStorage.setItem('blink_user', JSON.stringify(usuario));
        }
      } else {
        showToast(response?.message || 'Erro ao atualizar perfil', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      showToast('Erro ao conectar ao servidor', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSenha = async () => {
    if (!senhaData.senha_antiga) {
      showToast('Digite sua senha atual', 'error');
      return;
    }
    
    if (!senhaData.nova_senha || senhaData.nova_senha.length < 6) {
      showToast('A nova senha deve ter pelo menos 6 caracteres', 'error');
      return;
    }
    
    if (senhaData.nova_senha !== senhaData.confirmar_senha) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    setChangingPassword(true);
    try {
      const token = getToken();
      const response = await intermediarioAPI.alterarSenha(token, {
        senha_antiga: senhaData.senha_antiga,
        nova_senha: senhaData.nova_senha,
        confirmar_senha: senhaData.confirmar_senha
      });

      if (response && !response.error && response.success) {
        showToast('Senha alterada com sucesso!', 'success');
        setIsChangingPassword(false);
        setSenhaData({
          senha_antiga: '',
          nova_senha: '',
          confirmar_senha: ''
        });
      } else {
        showToast(response?.message || 'Erro ao alterar senha', 'error');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      showToast('Erro ao conectar ao servidor', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleFotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const fotoBase64 = ev.target.result;
          setPerfil({ ...perfil, foto_perfil: fotoBase64 });
          
          try {
            const token = getToken();
            const response = await intermediarioAPI.updateFotoPerfil(token, fotoBase64);
            if (response && !response.error && response.success) {
              showToast('Foto atualizada com sucesso!', 'success');
            } else {
              showToast(response?.message || 'Erro ao atualizar foto', 'error');
            }
          } catch (error) {
            console.error('Erro ao atualizar foto:', error);
            showToast('Erro ao atualizar foto', 'error');
          } finally {
            setLoading(false);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const fotoUrl = perfil.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(perfil.nome || 'I')}&background=1e3a5f&color=fff&size=120&bold=true`;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {toast.show && (
          <div className={`toast-notification toast-${toast.type}`}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{toast.message}</span>
          </div>
        )}

        <div className="modal-header">
          <div className="modal-logo">
            <span className="logo-text">BLINK</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="profile-container">
            <div className="profile-photo-section">
              <div className="profile-avatar">
                <img src={fotoUrl} alt={perfil.nome} />
                <button className="avatar-edit-btn" onClick={handleFotoUpload} disabled={loading}>
                  <i className="fas fa-camera"></i>
                </button>
                {loading && <div className="avatar-loading"><div className="spinner"></div></div>}
              </div>
            </div>

            <h2 className="profile-title">Meu Perfil</h2>
            <p className="profile-subtitle">Gerencie suas informações pessoais</p>

            {/* FORMULÁRIO DE EDIÇÃO DE PERFIL */}
            {isEditing && (
              <div className="profile-form">
                <div className="form-group">
                  <label><i className="fas fa-user"></i> Nome Completo</label>
                  <input
                    type="text"
                    value={editData.nome}
                    onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                    placeholder="Seu nome completo"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label><i className="fas fa-envelope"></i> E-mail</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label><i className="fas fa-phone"></i> Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    value={editData.telefone}
                    onChange={(e) => setEditData({ ...editData, telefone: e.target.value })}
                    placeholder="258841234567"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label><i className="fas fa-map-marker-alt"></i> Localização</label>
                  <input
                    type="text"
                    value={editData.localizacao}
                    onChange={(e) => setEditData({ ...editData, localizacao: e.target.value })}
                    placeholder="Maputo, Moçambique"
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSavePerfil} disabled={saving}>
                    <i className="fas fa-save"></i>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* FORMULÁRIO DE ALTERAÇÃO DE SENHA */}
            {isChangingPassword && (
              <div className="profile-form">
                <div className="form-group">
                  <label><i className="fas fa-lock"></i> Senha Atual</label>
                  <input
                    type="password"
                    value={senhaData.senha_antiga}
                    onChange={(e) => setSenhaData({ ...senhaData, senha_antiga: e.target.value })}
                    placeholder="Digite sua senha atual"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label><i className="fas fa-key"></i> Nova Senha</label>
                  <input
                    type="password"
                    value={senhaData.nova_senha}
                    onChange={(e) => setSenhaData({ ...senhaData, nova_senha: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label><i className="fas fa-check-circle"></i> Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={senhaData.confirmar_senha}
                    onChange={(e) => setSenhaData({ ...senhaData, confirmar_senha: e.target.value })}
                    placeholder="Digite novamente a nova senha"
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSaveSenha} disabled={changingPassword}>
                    <i className="fas fa-save"></i>
                    {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* VISUALIZAÇÃO DO PERFIL */}
            {!isEditing && !isChangingPassword && (
              <>
                <div className="profile-form">
                  <div className="form-group">
                    <label><i className="fas fa-user"></i> Nome Completo</label>
                    <div className="form-value">{perfil.nome || 'Não informado'}</div>
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-envelope"></i> E-mail</label>
                    <div className="form-value">{perfil.email || 'Não informado'}</div>
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-phone"></i> Telefone / WhatsApp</label>
                    <div className="form-value">{perfil.telefone || 'Não informado'}</div>
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-map-marker-alt"></i> Localização</label>
                    <div className="form-value">{perfil.localizacao || 'Não informado'}</div>
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-calendar-alt"></i> Membro desde</label>
                    <div className="form-value">{formatarData(perfil.data_criacao)}</div>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleEditClick}>
                    <i className="fas fa-edit"></i>
                    Editar Perfil
                  </button>
                  <button className="btn btn-secondary" onClick={handleChangePasswordClick}>
                    <i className="fas fa-key"></i>
                    Alterar Senha
                  </button>
                  <button className="btn btn-danger" onClick={onLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </div>
    </div>
  );
};

export default PerfilIntermediario;