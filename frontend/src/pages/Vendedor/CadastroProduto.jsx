import React, { useState, useEffect } from 'react';
import './CadastroProduto.css';
import { productsAPI } from '../../api';

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

const IconLocation = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const IconPackage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path>
    <line x1="16" y1="5" x2="8" y2="5"></line>
  </svg>
);

const IconBox = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="9" x2="15" y2="15"></line>
    <line x1="15" y1="9" x2="9" y2="15"></line>
  </svg>
);

const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
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
  const [taxaMarketplace] = useState(2);
  const [imagens, setImagens] = useState([]);
  const [previewImagens, setPreviewImagens] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [showAlert, setShowAlert] = useState({ show: false, title: '', message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const precoBruto = parseFloat(produto.preco) || 0;
  const taxaValor = (precoBruto * taxaMarketplace) / 100;

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
  }, []);

  const carregarRascunho = () => {
    const rascunho = localStorage.getItem('blink_rascunho_produto');
    if (rascunho) {
      const data = JSON.parse(rascunho);
      if (data.produto) {
        setProduto(data.produto);
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

  const mostrarAlerta = (title, message, type) => {
    setShowAlert({ show: true, title, message, type });
    setTimeout(() => setShowAlert({ show: false, title: '', message: '', type: 'info' }), 4000);
  };

  const salvarRascunho = () => {
    const rascunho = { 
      produto, 
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
        comissao_intermediario: 0,
        estado: 'publicado',
        foto_produto: imagens[0] || null,
        provincia: produto.provincia,
        intermediarios_ids: []
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
    setImagens([]);
    setPreviewImagens([]);
    setPreviewImage('');
  };

  const truncarTexto = (texto, limite = 80) => {
    if (!texto) return "Sem descrição";
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + "...";
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
                placeholder="Descreva seu produto detalhadamente..." 
              />
            </div>
          </div>
        </div>

        <div className="dv-cadastro-col">
          {/* Resumo da Venda - Movido para cima */}
          <div className="dv-resumo-card">
            <div className="dv-card-title">Resumo da Venda</div>
            
            <div className="dv-resumo-linha">
              <span>Preço Bruto</span>
              <span className="dv-value">{precoBruto.toFixed(2)} MZN</span>
            </div>
            <div className="dv-resumo-linha">
              <span>Taxa Marketplace</span>
              <span className="dv-value">{taxaValor.toFixed(2)} MZN</span>
            </div>
            <div className="dv-resumo-divider"></div>
            <div className="dv-resumo-linha dv-total">
              <span><strong>Recebimento Estimado</strong></span>
              <span className="dv-total-value"><strong>{(precoBruto - taxaValor).toFixed(2)} MZN</strong></span>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <IconInfo />
              Informações Adicionais
            </div>
            
            <div className="dv-info-badge">
              <IconInfo />
              <span>Seu produto será vendido diretamente no marketplace</span>
            </div>
            
            <div className="dv-form-group">
              <label className="dv-label">Vendedor</label>
              <input 
                type="text" 
                className="dv-input" 
                value={usuarioLogado.nome} 
                disabled
                style={{ background: "#f5f5f5" }}
              />
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
    </div>
  );
};

export default CadastroProduto;
