import React, { useState, useEffect } from 'react';
import './CadastroProduto.css';
import { productsAPI, intermediariosAPI } from '../../api';

// Lista de províncias de Moçambique
const provinciasMocambique = [
  "Maputo Cidade",
  "Maputo Província",
  "Gaza",
  "Inhambane",
  "Manica",
  "Sofala",
  "Tete",
  "Zambézia",
  "Nampula",
  "Cabo Delgado",
  "Niassa"
];

// ============================================
// ÍCONES PROFISSIONAIS EM SVG - Azul #1e3a5f
// ============================================

const IconImage = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const IconStarOutline = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const IconLocation = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconCheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const IconPackage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path>
    <line x1="16" y1="5" x2="8" y2="5"></line>
  </svg>
);

const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const IconBox = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="9" x2="15" y2="15"></line>
    <line x1="15" y1="9" x2="9" y2="15"></line>
  </svg>
);

const IconEmail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconToggleOn = () => (
  <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="20" rx="10" fill="#1e3a5f"/>
    <circle cx="26" cy="10" r="7" fill="white"/>
  </svg>
);

const IconToggleOff = () => (
  <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="20" rx="10" fill="#cbd5e1"/>
    <circle cx="10" cy="10" r="7" fill="white"/>
  </svg>
);

const CadastroProduto = ({ onProductAdded }) => {
  const [usuarioLogado, setUsuarioLogado] = useState({ nome: 'Usuario', email: '', tipo_usuario: '', id: null });
  const [produto, setProduto] = useState({
    nome: '',
    categoria: 'Eletronicos',
    subcategoria: '',
    condicao: 'Novo',
    preco: '',
    provincia: '',
    descricao: ''
  });
  const [comissao, setComissao] = useState(5);
  const [avaliacaoMinima, setAvaliacaoMinima] = useState('4.5');
  const [taxaMarketplace] = useState(2);
  const [intermediariosSelecionados, setIntermediariosSelecionados] = useState([]);
  const [intermediariosAtivo, setIntermediariosAtivo] = useState(false); // Toggle para ligar/desligar
  const [imagens, setImagens] = useState([]);
  const [previewImagens, setPreviewImagens] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [buscaIntermediarios, setBuscaIntermediarios] = useState('');
  const [intermediariosDisponiveis, setIntermediariosDisponiveis] = useState([]);
  const [loadingIntermediarios, setLoadingIntermediarios] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, title: '', message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const precoBruto = parseFloat(produto.preco) || 0;
  const comissaoValor = (precoBruto * comissao) / 100;
  const taxaValor = (precoBruto * taxaMarketplace) / 100;
  const recebimentoEstimado = precoBruto - comissaoValor - taxaValor;

  // Buscar intermediários reais do backend
  const fetchIntermediarios = async () => {
    setLoadingIntermediarios(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token não encontrado");
        setLoadingIntermediarios(false);
        return;
      }
      
      const response = await intermediariosAPI.listarIntermediarios(token);
      
      if (response.error) {
        console.error("Erro ao buscar intermediários:", response.message);
      } else if (Array.isArray(response)) {
        setIntermediariosDisponiveis(response);
      }
    } catch (error) {
      console.error("Erro ao buscar intermediários:", error);
    } finally {
      setLoadingIntermediarios(false);
    }
  };

  useEffect(() => {
    const usuarioData = localStorage.getItem("blink_user");
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      setUsuarioLogado({
        nome: usuario.nome || "Usuario",
        email: usuario.email || "",
        tipo_usuario: usuario.tipo_usuario || "",
        id: usuario.id
      });
    }
    
    carregarRascunho();
    fetchIntermediarios();
  }, []);

  const carregarRascunho = () => {
    const rascunho = localStorage.getItem('blink_rascunho_produto');
    if (rascunho) {
      const data = JSON.parse(rascunho);
      if (data.produto) {
        setProduto(data.produto);
        setComissao(data.comissao || 5);
        setAvaliacaoMinima(data.avaliacaoMinima || '4.5');
        if (data.intermediariosSelecionados) setIntermediariosSelecionados(data.intermediariosSelecionados);
        if (data.intermediariosAtivo !== undefined) setIntermediariosAtivo(data.intermediariosAtivo);
        if (data.imagens) setImagens(data.imagens);
        if (data.previewImagens) setPreviewImagens(data.previewImagens);
        if (data.previewImage) setPreviewImage(data.previewImage);
        mostrarAlerta('Rascunho encontrado', `Rascunho de "${data.produto.nome || 'produto'}" carregado.`, 'info');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const handleCondicaoChange = (valor) => {
    setProduto({ ...produto, condicao: valor });
  };

  const handleImagemUpload = (e) => {
    const files = Array.from(e.target.files);
    if (imagens.length + files.length > 5) {
      mostrarAlerta('Erro', 'Máximo 5 imagens permitidas!', 'error');
      return;
    }
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setImagens(prev => [...prev, ev.target.result]);
          setPreviewImagens(prev => [...prev, ev.target.result]);
          if (!previewImage) {
            setPreviewImage(ev.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removerImagem = (index) => {
    const novasImagens = [...imagens];
    novasImagens.splice(index, 1);
    setImagens(novasImagens);
    const novosPreviews = [...previewImagens];
    novosPreviews.splice(index, 1);
    setPreviewImagens(novosPreviews);
    if (index === 0 && novosPreviews.length > 0) {
      setPreviewImage(novosPreviews[0]);
    } else if (novosPreviews.length === 0) {
      setPreviewImage('');
    }
  };

  const adicionarIntermediario = (intermediario) => {
    if (intermediariosSelecionados.length >= 3) {
      mostrarAlerta('Limite atingido', 'Você pode selecionar no máximo 3 intermediários!', 'error');
      return false;
    }
    
    if (intermediariosSelecionados.some(i => i.id === intermediario.id)) {
      mostrarAlerta('Aviso', `${intermediario.nome} já está na lista!`, 'info');
      return false;
    }
    
    setIntermediariosSelecionados([...intermediariosSelecionados, intermediario]);
    mostrarAlerta('Intermediário adicionado', `${intermediario.nome} foi adicionado à lista`, 'success');
    return true;
  };

  const removerIntermediario = (id) => {
    const removido = intermediariosSelecionados.find(i => i.id === id);
    setIntermediariosSelecionados(intermediariosSelecionados.filter(i => i.id !== id));
    if (removido) {
      mostrarAlerta('Intermediário removido', `${removido.nome} foi removido da lista`, 'info');
    }
  };

  const intermediariosFiltrados = intermediariosDisponiveis.filter(inter =>
    inter.nome.toLowerCase().includes(buscaIntermediarios.toLowerCase()) ||
    inter.email.toLowerCase().includes(buscaIntermediarios.toLowerCase())
  );

  const mostrarAlerta = (title, message, type) => {
    setShowAlert({ show: true, title, message, type });
    setTimeout(() => setShowAlert({ show: false, title: '', message: '', type: 'info' }), 4000);
  };

  const salvarRascunho = () => {
    const rascunho = { 
      produto, 
      comissao, 
      avaliacaoMinima, 
      intermediariosSelecionados,
      intermediariosAtivo,
      imagens,
      previewImagens,
      previewImage,
      dataSalvo: new Date().toISOString()
    };
    localStorage.setItem('blink_rascunho_produto', JSON.stringify(rascunho));
    mostrarAlerta('Rascunho salvo', 'Produto salvo como rascunho!', 'success');
  };

  const publicarProduto = async () => {
    if (!produto.nome) {
      mostrarAlerta('Erro', 'Preencha o nome do produto!', 'error');
      return;
    }
    if (imagens.length === 0) {
      mostrarAlerta('Erro', 'Adicione pelo menos uma imagem!', 'error');
      return;
    }
    if (!produto.preco || precoBruto <= 0) {
      mostrarAlerta('Erro', 'Informe um preço de venda válido!', 'error');
      return;
    }
    if (!produto.provincia) {
      mostrarAlerta('Erro', 'Selecione a província!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        mostrarAlerta('Erro', 'Token de autenticação não encontrado. Faça login novamente.', 'error');
        setIsSubmitting(false);
        return;
      }

      const categoriasMap = {
        'Eletronicos': 1,
        'Moda': 2,
        'Casa & Decoracao': 3,
        'Esportes': 4,
        'Livros': 5,
        'Automotivo': 6,
        'Outros': 7
      };

      const produtoData = {
        categoria_id: categoriasMap[produto.categoria] || null,
        nome: produto.nome,
        descricao: produto.descricao || "",
        preco_minimo: precoBruto,
        comissao_intermediario: comissaoValor,
        estado: 'publicado',
        foto_produto: imagens[0] || null,
        provincia: produto.provincia,
        intermediarios_ids: intermediariosAtivo ? intermediariosSelecionados.map(i => i.id) : []
      };

      const result = await productsAPI.createProduct(token, produtoData);

      if (result.error) {
        mostrarAlerta('Erro', result.message || 'Erro ao publicar produto', 'error');
      } else {
        localStorage.removeItem('blink_rascunho_produto');
        mostrarAlerta('Sucesso!', `"${produto.nome}" foi publicado!`, 'success');
        limparFormulario();
        
        if (onProductAdded) {
          setTimeout(() => onProductAdded(), 1500);
        }
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      mostrarAlerta('Erro', 'Erro de conexão com o servidor.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const limparFormulario = () => {
    setProduto({
      nome: '',
      categoria: 'Eletronicos',
      subcategoria: '',
      condicao: 'Novo',
      preco: '',
      provincia: '',
      descricao: ''
    });
    setComissao(5);
    setAvaliacaoMinima('4.5');
    setImagens([]);
    setPreviewImagens([]);
    setPreviewImage('');
    setIntermediariosSelecionados([]);
    setIntermediariosAtivo(false);
  };

  const truncarTexto = (texto, limite = 80) => {
    if (!texto) return "Sem descrição";
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + "...";
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<IconStar key={i} />);
    }
    for (let i = fullStars; i < 5; i++) {
      stars.push(<IconStarOutline key={i} />);
    }
    return stars;
  };

  return (
    <div className="dv-cadastro-container">
      {showAlert.show && (
        <div className={`dv-custom-alert ${showAlert.type}`}>
          <div className="dv-alert-content">
            <div className="dv-alert-title">{showAlert.title}</div>
            <div className="dv-alert-message">{showAlert.message}</div>
          </div>
          <button className="dv-alert-close" onClick={() => setShowAlert({ show: false })}>×</button>
        </div>
      )}

      <div className="dv-cadastro-header">
        <h1 className="dv-cadastro-title">Adicionar Novo Produto</h1>
        <p className="dv-cadastro-subtitle">Preencha os dados abaixo para publicar seu produto no marketplace</p>
      </div>

      <div className="dv-cadastro-grid">
        <div className="dv-cadastro-col">
          {/* Informações Básicas */}
          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <IconPackage />
              Informações Básicas
            </div>
            
            <div className="dv-form-group">
              <label className="dv-label">Nome do Produto *</label>
              <input 
                type="text" 
                name="nome" 
                className="dv-input" 
                value={produto.nome} 
                onChange={handleInputChange} 
                placeholder="Ex: Smartwatch Series X" 
              />
            </div>
            
            <div className="dv-row-2col">
              <div className="dv-form-group">
                <label className="dv-label">Categoria</label>
                <select name="categoria" className="dv-select" value={produto.categoria} onChange={handleInputChange}>
                  <option>Eletronicos</option>
                  <option>Moda</option>
                  <option>Casa & Decoracao</option>
                  <option>Esportes</option>
                  <option>Livros</option>
                  <option>Automotivo</option>
                  <option>Outros</option>
                </select>
              </div>
              <div className="dv-form-group">
                <label className="dv-label">Subcategoria</label>
                <input 
                  type="text" 
                  name="subcategoria" 
                  className="dv-input" 
                  value={produto.subcategoria} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Smartwatches" 
                />
              </div>
            </div>
            
            <label className="dv-label">Condição</label>
            <div className="dv-condition-row">
              <div 
                className={`dv-condition-card ${produto.condicao === 'Novo' ? 'dv-selected' : ''}`} 
                onClick={() => handleCondicaoChange('Novo')}
              >
                <IconPackage /> Novo
              </div>
              <div 
                className={`dv-condition-card ${produto.condicao === 'Usado' ? 'dv-selected' : ''}`} 
                onClick={() => handleCondicaoChange('Usado')}
              >
                <IconBox /> Usado
              </div>
            </div>
          </div>

          {/* Imagens */}
          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <IconImage />
              Imagens do Produto
            </div>
            
            <div className="dv-upload-area" onClick={() => document.getElementById('dv-file-input').click()}>
              <IconImage />
              <p>Clique para selecionar imagens<br /><small>Máximo 5 imagens</small></p>
              <input type="file" id="dv-file-input" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImagemUpload} />
            </div>
            
            {previewImagens.length > 0 && (
              <div className="dv-preview-grid">
                {previewImagens.map((src, idx) => (
                  <div key={idx} className="dv-preview-item">
                    <img src={src} alt="Preview" />
                    <button className="dv-remove-img" onClick={() => removerImagem(idx)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detalhes e Preço */}
          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <IconTag />
              Detalhes e Preço
            </div>
            
            <div className="dv-form-group">
              <label className="dv-label">Preço de Venda (MZN) *</label>
              <input 
                type="number" 
                name="preco" 
                className="dv-input" 
                value={produto.preco} 
                onChange={handleInputChange} 
                placeholder="0,00" 
                step="any" 
              />
            </div>
            
            <div className="dv-form-group">
              <label className="dv-label">Província / Cidade *</label>
              <select 
                name="provincia" 
                className="dv-select" 
                value={produto.provincia} 
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione uma província</option>
                {provinciasMocambique.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
            
            <div className="dv-form-group">
              <label className="dv-label">Descrição Detalhada</label>
              <textarea 
                name="descricao" 
                className="dv-textarea" 
                rows="4" 
                value={produto.descricao} 
                onChange={handleInputChange} 
                placeholder="Descreva seu produto..." 
              />
            </div>
          </div>
        </div>

        <div className="dv-cadastro-col">
          {/* Configurações de Intermediário */}
          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <IconUser />
              Configurações de Intermediário
            </div>
            
            {/* Toggle para ligar/desligar intermediários */}
            <div className="dv-toggle-intermediarios">
              <div className="dv-toggle-label">
                <IconInfo />
                <span>Ativar intermediação para este produto</span>
              </div>
              <button 
                className="dv-toggle-button"
                onClick={() => setIntermediariosAtivo(!intermediariosAtivo)}
              >
                {intermediariosAtivo ? <IconToggleOn /> : <IconToggleOff />}
              </button>
            </div>

            {intermediariosAtivo && (
              <>
                <div className="dv-info-badge">
                  <IconInfo />
                  <span>Você pode atribuir até 3 intermediários ao seu produto</span>
                </div>

                <div className="dv-form-group">
                  <label className="dv-label">Comissão (%)</label>
                  <div className="dv-comissao-row">
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      step="0.5" 
                      value={comissao} 
                      onChange={(e) => setComissao(parseFloat(e.target.value))} 
                      className="dv-range"
                    />
                    <div className="dv-comissao-input">
                      <input 
                        type="number" 
                        value={comissao} 
                        onChange={(e) => setComissao(parseFloat(e.target.value))} 
                        step="0.5" 
                        min="1" 
                        max="20"
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <small className="dv-hint">A comissão média nesta categoria é de 4-7%</small>
                </div>

                <div className="dv-form-group">
                  <label className="dv-label">Avaliação Mínima</label>
                  <div className="dv-rating-buttons">
                    {['1.0', '2.5', '4.0', '4.5', '5.0'].map(nota => (
                      <button 
                        key={nota} 
                        className={`dv-rating-btn ${avaliacaoMinima === nota ? 'dv-active' : ''}`} 
                        onClick={() => setAvaliacaoMinima(nota)}
                      >
                        {nota}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="dv-form-group">
                  <label className="dv-label">
                    Intermediários Selecionados 
                    <span className="dv-counter">({intermediariosSelecionados.length}/3)</span>
                  </label>
                  
                  <div className="dv-intermediarios-list">
                    {intermediariosSelecionados.map(inter => (
                      <div key={inter.id} className="dv-intermediario-tag">
                        <span className="dv-tag-icon"><IconUser /></span>
                        <div className="dv-tag-info">
                          <strong>{inter.nome}</strong>
                          <small>Avaliação: {inter.avaliacao || 4.5} ★</small>
                        </div>
                        <button className="dv-remove-tag" onClick={() => removerIntermediario(inter.id)}>
                          <IconTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {intermediariosSelecionados.length < 3 && (
                    <button className="dv-search-link" onClick={() => setShowModal(true)}>
                      <IconSearch /> Buscar intermediários
                    </button>
                  )}
                  
                  {intermediariosSelecionados.length === 0 && (
                    <small className="dv-hint">Nenhum intermediário selecionado. Clique em "Buscar intermediários" para adicionar.</small>
                  )}
                </div>
              </>
            )}

            {!intermediariosAtivo && (
              <div className="dv-info-badge dv-info-muted">
                <IconInfo />
                <span>Intermediação desativada. O produto será vendido diretamente.</span>
              </div>
            )}
          </div>

          {/* Resumo da Venda */}
          <div className="dv-resumo-card">
            <div className="dv-card-title">Resumo da Venda</div>
            
            <div className="dv-resumo-linha">
              <span>Preço Bruto</span>
              <span className="dv-value">{precoBruto.toFixed(2)} MZN</span>
            </div>
            {intermediariosAtivo && (
              <div className="dv-resumo-linha">
                <span>Comissão ({comissao}%)</span>
                <span className="dv-value">{comissaoValor.toFixed(2)} MZN</span>
              </div>
            )}
            <div className="dv-resumo-linha">
              <span>Taxa Marketplace</span>
              <span className="dv-value">{taxaValor.toFixed(2)} MZN</span>
            </div>
            <div className="dv-resumo-divider"></div>
            <div className="dv-resumo-linha dv-total">
              <span><strong>Recebimento Estimado</strong></span>
              <span className="dv-total-value"><strong>
                {intermediariosAtivo 
                  ? recebimentoEstimado.toFixed(2) 
                  : (precoBruto - taxaValor).toFixed(2)} MZN
              </strong></span>
            </div>
          </div>

          {/* Pré-visualização */}
          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <IconImage />
              Pré-visualização
            </div>
            
            <div className="dv-product-preview">
              <div className="dv-preview-img">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" />
                ) : (
                  <div className="dv-no-image">
                    <IconImage />
                    <span>Sem imagem</span>
                  </div>
                )}
              </div>
              <div className="dv-preview-details">
                <h3 className="dv-preview-title">{produto.nome || "Nome do produto"}</h3>
                <p className="dv-preview-price">{precoBruto.toFixed(2)} MZN</p>
                <p className="dv-preview-description">{truncarTexto(produto.descricao, 80)}</p>
                <div className="dv-preview-meta">
                  <span className="dv-preview-category"><IconTag /> {produto.categoria}</span>
                  <span className="dv-preview-condition"><IconBox /> {produto.condicao}</span>
                  {produto.provincia && <span className="dv-preview-location"><IconLocation /> {produto.provincia}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="dv-action-buttons">
        <button className="dv-btn dv-btn-outline" onClick={limparFormulario} disabled={isSubmitting}>
          Limpar Formulário
        </button>
        <button className="dv-btn dv-btn-secondary" onClick={salvarRascunho} disabled={isSubmitting}>
          Salvar como Rascunho
        </button>
        <button className="dv-btn dv-btn-primary" onClick={publicarProduto} disabled={isSubmitting}>
          {isSubmitting ? 'Publicando...' : 'Publicar Produto'}
        </button>
      </div>

      {/* Modal de Busca de Intermediários */}
      {showModal && (
        <div className="dv-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="dv-modal-intermediarios" onClick={(e) => e.stopPropagation()}>
            <div className="dv-modal-header">
              <div className="dv-modal-title">
                <IconUser />
                <h3>Buscar Intermediários</h3>
              </div>
              <button className="dv-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="dv-modal-search">
              <div className="dv-search-input-wrapper">
                <IconSearch />
                <input 
                  type="text" 
                  placeholder="Digite nome ou email..." 
                  value={buscaIntermediarios} 
                  onChange={(e) => setBuscaIntermediarios(e.target.value)} 
                  autoFocus
                />
                {buscaIntermediarios && (
                  <button className="dv-clear-search" onClick={() => setBuscaIntermediarios('')}>
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <div className="dv-modal-results">
              {loadingIntermediarios ? (
                <div className="dv-loading-state">
                  <div className="dv-spinner"></div>
                  <span>Carregando intermediários...</span>
                </div>
              ) : intermediariosFiltrados.length > 0 ? (
                <div className="dv-intermediarios-list-modal">
                  {intermediariosFiltrados.map(inter => (
                    <div key={inter.id} className="dv-search-result-item">
                      <div className="dv-result-avatar">
                        <IconUser />
                      </div>
                      <div className="dv-result-info">
                        <div className="dv-result-name">{inter.nome}</div>
                        <div className="dv-result-details">
                          <span className="dv-result-email"><IconEmail /> {inter.email}</span>
                          <span className="dv-result-location"><IconLocation /> {inter.cidade || 'N/A'}</span>
                        </div>
                        <div className="dv-result-rating">
                          {renderStars(inter.avaliacao || 4.5)}
                          <span className="dv-rating-value">{inter.avaliacao || 4.5}</span>
                        </div>
                      </div>
                      <button 
                        className={`dv-add-result-btn ${intermediariosSelecionados.some(i => i.id === inter.id) ? 'dv-added' : ''}`}
                        onClick={() => adicionarIntermediario(inter)}
                        disabled={intermediariosSelecionados.some(i => i.id === inter.id)}
                      >
                        {intermediariosSelecionados.some(i => i.id === inter.id) ? (
                          <>
                            <IconCheckCircle /> Adicionado
                          </>
                        ) : (
                          <>
                            <IconPlus /> Adicionar
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dv-no-results-state">
                  <IconSearch />
                  <p>Nenhum intermediário encontrado</p>
                  {buscaIntermediarios && <small>para "{buscaIntermediarios}"</small>}
                  {!buscaIntermediarios && intermediariosDisponiveis.length === 0 && (
                    <small>Não há intermediários cadastrados no sistema</small>
                  )}
                </div>
              )}
            </div>
            
            <div className="dv-modal-footer">
              <div className="dv-selected-info">
                {intermediariosSelecionados.length > 0 && (
                  <span>{intermediariosSelecionados.length} de 3 intermediários selecionados</span>
                )}
              </div>
              <button className="dv-btn-cancel" onClick={() => setShowModal(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroProduto;

