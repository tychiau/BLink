import React, { useState, useEffect } from 'react';
import './CadastroProduto.css';

const CadastroProduto = ({ onProductAdded }) => {
  const [usuarioLogado, setUsuarioLogado] = useState({ nome: 'Usuário', email: '', tipo_usuario: '', id: null });
  const [produto, setProduto] = useState({
    nome: '',
    categoria: 'Eletrônicos',
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
  const [imagens, setImagens] = useState([]);
  const [previewImagens, setPreviewImagens] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [novoIntermediario, setNovoIntermediario] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [buscaIntermediarios, setBuscaIntermediarios] = useState('');
  const [showAlert, setShowAlert] = useState({ show: false, title: '', message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intermediariosDisponiveis = [
    { id: 1, nome: "Carlos Mendes", email: "carlos@blink.mz", telefone: "84 123 4567", avaliacao: 4.8, cidade: "Maputo" },
    { id: 2, nome: "Maria João", email: "maria@blink.mz", telefone: "85 234 5678", avaliacao: 4.9, cidade: "Matola" },
    { id: 3, nome: "Paulo Santos", email: "paulo@blink.mz", telefone: "86 345 6789", avaliacao: 4.7, cidade: "Beira" },
    { id: 4, nome: "Fernanda Lima", email: "fernanda@blink.mz", telefone: "87 456 7890", avaliacao: 5.0, cidade: "Nampula" },
  ];

  const precoBruto = parseFloat(produto.preco) || 0;
  const comissaoValor = (precoBruto * comissao) / 100;
  const taxaValor = (precoBruto * taxaMarketplace) / 100;
  const recebimentoEstimado = precoBruto - comissaoValor - taxaValor;

  useEffect(() => {
    const usuarioData = localStorage.getItem("blink_user");
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      setUsuarioLogado({
        nome: usuario.nome || "Usuário",
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
        setComissao(data.comissao || 5);
        setAvaliacaoMinima(data.avaliacaoMinima || '4.5');
        if (data.intermediariosSelecionados) setIntermediariosSelecionados(data.intermediariosSelecionados);
        if (data.imagens) setImagens(data.imagens);
        if (data.previewImagens) setPreviewImagens(data.previewImagens);
        if (data.previewImage) setPreviewImage(data.previewImage);
        mostrarAlerta('Rascunho encontrado', `Rascunho de "${data.produto.nome || 'produto'}" carregado.`, 'info');
      }
    }
  };

  const handleInputChange = (e) => {
    setProduto({ ...produto, [e.target.name]: e.target.value });
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
          mostrarAlerta('Imagem adicionada', `${file.name} foi adicionada`, 'success');
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
    mostrarAlerta('Imagem removida', 'Imagem removida com sucesso', 'info');
  };

  const adicionarIntermediario = (nome) => {
    if (intermediariosSelecionados.includes(nome)) {
      mostrarAlerta('Aviso', `${nome} já está na lista!`, 'info');
      return false;
    }
    setIntermediariosSelecionados([...intermediariosSelecionados, nome]);
    mostrarAlerta('Intermediário adicionado', `${nome} foi adicionado à lista`, 'success');
    return true;
  };

  const removerIntermediario = (nome) => {
    setIntermediariosSelecionados(intermediariosSelecionados.filter(i => i !== nome));
    mostrarAlerta('Intermediário removido', `${nome} foi removido da lista`, 'info');
  };

  const adicionarIntermediarioManual = () => {
    if (!novoIntermediario.trim()) {
      mostrarAlerta('Erro', 'Digite o nome do intermediário!', 'error');
      return;
    }
    adicionarIntermediario(novoIntermediario.trim());
    setNovoIntermediario('');
  };

  const intermediariosFiltrados = intermediariosDisponiveis.filter(inter =>
    inter.nome.toLowerCase().includes(buscaIntermediarios.toLowerCase()) ||
    inter.email.toLowerCase().includes(buscaIntermediarios.toLowerCase()) ||
    inter.telefone.includes(buscaIntermediarios)
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

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      
      // Buscar o ID do vendedor logado
      const usuarioData = localStorage.getItem("blink_user");
      const usuario = JSON.parse(usuarioData);
      
      if (!usuario || !usuario.id) {
        mostrarAlerta('Erro', 'Usuário não identificado. Faça login novamente.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Mapear categoria para categoria_id
      const categoriasMap = {
        'Eletrônicos': 1,
        'Moda': 2,
        'Casa & Decoração': 3,
        'Esportes': 4,
        'Livros': 5,
        'Automotivo': 6,
        'Outros': 7
      };

      // Preparar dados no formato correto para o backend
      const produtoData = {
        vendedor_id: usuario.id.toString(), // Converter para string se necessário
        categoria_id: categoriasMap[produto.categoria] || null,
        nome: produto.nome,
        descricao: produto.descricao,
        preco_minimo: precoBruto,
        comissao_intermediario: comissaoValor,
        estado: 'rascunho',
        foto_produto: imagens[0] || null
      };

      console.log("Enviando para o backend:", produtoData);
      console.log("Token usado:", token);

      const response = await fetch('http://localhost:5173/api/products/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produtoData)
      });

      const responseData = await response.json();
      console.log("Resposta do backend:", responseData);

      if (response.ok) {
        localStorage.removeItem('blink_rascunho_produto');
        mostrarAlerta('Sucesso!', `"${produto.nome}" foi publicado!`, 'success');
        limparFormulario();
        
        if (onProductAdded) {
          setTimeout(() => onProductAdded(), 1500);
        }
      } else {
        mostrarAlerta('Erro', responseData.message || 'Erro ao publicar produto no servidor', 'error');
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      mostrarAlerta('Erro', 'Erro de conexão com o servidor. Verifique se o backend está rodando.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const limparFormulario = () => {
    setProduto({
      nome: '',
      categoria: 'Eletrônicos',
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
    mostrarAlerta('Formulário limpo', 'Todos os campos foram resetados!', 'success');
  };

  // Função para truncar texto da descrição na pré-visualização
  const truncarTexto = (texto, limite = 60) => {
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
        {/* COLUNA ESQUERDA */}
        <div className="dv-cadastro-col">
          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <span className="dv-card-icon">📋</span>
              Informações Básicas
            </div>
            <div className="dv-form-group">
              <label className="dv-label">NOME DO PRODUTO *</label>
              <input type="text" name="nome" className="dv-input" value={produto.nome} onChange={handleInputChange} placeholder="Ex: Smartwatch Series X" />
            </div>
            <div className="dv-row-2col">
              <div className="dv-form-group">
                <label className="dv-label">CATEGORIA</label>
                <select name="categoria" className="dv-select" value={produto.categoria} onChange={handleInputChange}>
                  <option>Eletrônicos</option>
                  <option>Moda</option>
                  <option>Casa & Decoração</option>
                  <option>Esportes</option>
                  <option>Livros</option>
                  <option>Automotivo</option>
                  <option>Outros</option>
                </select>
              </div>
              <div className="dv-form-group">
                <label className="dv-label">SUBCATEGORIA</label>
                <input type="text" name="subcategoria" className="dv-input" value={produto.subcategoria} onChange={handleInputChange} placeholder="Ex: Smartwatches" />
              </div>
            </div>
            
            <div className="dv-section-label">CONDIÇÃO</div>
            <div className="dv-condition-row">
              <div className={`dv-condition-card ${produto.condicao === 'Novo' ? 'dv-selected' : ''}`} onClick={() => handleCondicaoChange('Novo')}>
                <span>✨</span> Novo
              </div>
              <div className={`dv-condition-card ${produto.condicao === 'Usado' ? 'dv-selected' : ''}`} onClick={() => handleCondicaoChange('Usado')}>
                <span>🔄</span> Usado
              </div>
            </div>
          </div>

          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <span className="dv-card-icon">🖼️</span>
              Imagens do Produto
            </div>
            <div className="dv-upload-area" onClick={() => document.getElementById('dv-file-input').click()}>
              <span className="dv-upload-icon">📸</span>
              <p>Clique para selecionar imagens<br /><small>Máximo 5 imagens</small></p>
              <input type="file" id="dv-file-input" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImagemUpload} />
            </div>
            <div className="dv-preview-grid">
              {previewImagens.map((src, idx) => (
                <div key={idx} className="dv-preview-item">
                  <img src={src} alt="Preview" />
                  <button className="dv-remove-img" onClick={() => removerImagem(idx)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <span className="dv-card-icon">💰</span>
              Detalhes e Preço
            </div>
            <div className="dv-form-group">
              <label className="dv-label">PREÇO DE VENDA (MZN) *</label>
              <input type="number" name="preco" className="dv-input" value={produto.preco} onChange={handleInputChange} placeholder="0,00" step="any" />
            </div>
            <div className="dv-form-group">
              <label className="dv-label">PROVÍNCIA / CIDADE</label>
              <input type="text" name="provincia" className="dv-input" value={produto.provincia} onChange={handleInputChange} placeholder="Ex: Maputo" />
            </div>
            <div className="dv-form-group">
              <label className="dv-label">DESCRIÇÃO DETALHADA</label>
              <textarea name="descricao" className="dv-textarea" rows="4" value={produto.descricao} onChange={handleInputChange} placeholder="Descreva seu produto..."></textarea>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="dv-cadastro-col">
          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <span className="dv-card-icon">🤝</span>
              Configurações de Intermediário
            </div>
            
            <div className="dv-toggle-row">
              <span>🌍 Permitir qualquer intermediário</span>
              <label className="dv-switch">
                <input type="checkbox" defaultChecked />
                <span className="dv-slider"></span>
              </label>
            </div>

            <div className="dv-form-group">
              <label className="dv-label">COMISSÃO</label>
              <div className="dv-comissao-row">
                <span>Percentual sobre venda</span>
                <div className="dv-comissao-input">
                  <input type="number" value={comissao} onChange={(e) => setComissao(parseFloat(e.target.value))} step="0.5" />
                  <span>%</span>
                </div>
              </div>
              <small className="dv-hint">A comissão média nesta categoria é de 4-7%</small>
            </div>

            <div className="dv-form-group">
              <label className="dv-label">AVALIAÇÃO MÍNIMA</label>
              <div className="dv-rating-buttons">
                {['1.0', '2.5', '4.0', '4.5', '5.0'].map(nota => (
                  <button key={nota} className={`dv-rating-btn ${avaliacaoMinima === nota ? 'dv-active' : ''}`} onClick={() => setAvaliacaoMinima(nota)}>{nota}</button>
                ))}
              </div>
            </div>

            <div className="dv-form-group">
              <label className="dv-label">INTERMEDIÁRIOS SELECIONADOS</label>
              <div className="dv-intermediarios-list">
                {intermediariosSelecionados.map(nome => (
                  <div key={nome} className="dv-intermediario-tag">
                    👤 {nome}
                    <button className="dv-remove-tag" onClick={() => removerIntermediario(nome)}>×</button>
                  </div>
                ))}
              </div>
              <div className="dv-add-intermediario">
                <input type="text" placeholder="Nome do intermediário" value={novoIntermediario} onChange={(e) => setNovoIntermediario(e.target.value)} />
                <button className="dv-btn-small" onClick={adicionarIntermediarioManual}>Adicionar</button>
              </div>
              <button className="dv-search-link" onClick={() => setShowModal(true)}>Buscar intermediários</button>
            </div>
          </div>

          <div className="dv-resumo-card">
            <div className="dv-card-title">
              <span className="dv-card-icon">📊</span>
              RESUMO DA VENDA
            </div>
            <div className="dv-resumo-linha">
              <span>Preço Bruto</span>
              <span>{precoBruto.toFixed(2)} MZN</span>
            </div>
            <div className="dv-resumo-linha">
              <span>Comissão ({comissao}%)</span>
              <span>{comissaoValor.toFixed(2)} MZN</span>
            </div>
            <div className="dv-resumo-linha">
              <span>Taxa Marketplace</span>
              <span>{taxaValor.toFixed(2)} MZN</span>
            </div>
            <div className="dv-resumo-linha dv-total">
              <span><strong>Recebimento Estimado</strong></span>
              <span><strong>{recebimentoEstimado.toFixed(2)} MZN</strong></span>
            </div>
          </div>

          {/* PRÉ-VISUALIZAÇÃO CORRIGIDA - TEXTO NÃO ULTRAPASSA OS LIMITES */}
          <div className="dv-cadastro-card">
            <div className="dv-card-title">
              <span className="dv-card-icon">👁️</span>
              Pré-visualização
            </div>
            <div className="dv-product-preview">
              <div className="dv-preview-img">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" />
                ) : (
                  <div className="dv-no-image">🖼️ Sem imagem</div>
                )}
              </div>
              <div className="dv-preview-details">
                <h3 className="dv-preview-title">{produto.nome || "Nome do produto"}</h3>
                <p className="dv-preview-price">{precoBruto.toFixed(2)} MZN</p>
                <p className="dv-preview-description">{truncarTexto(produto.descricao, 80)}</p>
                <div className="dv-preview-meta">
                  <span className="dv-preview-category">🏷️ {produto.categoria}</span>
                  <span className="dv-preview-condition">📦 {produto.condicao}</span>
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

      {/* Modal de Busca */}
      {showModal && (
        <div className="dv-modal" onClick={() => setShowModal(false)}>
          <div className="dv-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dv-modal-header">
              <h3>Buscar Intermediários</h3>
              <button className="dv-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="dv-modal-search">
              <input type="text" placeholder="Digite nome, email ou telefone..." value={buscaIntermediarios} onChange={(e) => setBuscaIntermediarios(e.target.value)} />
            </div>
            <div className="dv-modal-results">
              {intermediariosFiltrados.map(inter => (
                <div key={inter.id} className="dv-search-result">
                  <div>
                    <strong>{inter.nome}</strong>
                    <small>{inter.email} | {inter.telefone}</small>
                  </div>
                  <button className="dv-add-result" onClick={() => adicionarIntermediario(inter.nome)}>Adicionar</button>
                </div>
              ))}
              {intermediariosFiltrados.length === 0 && (
                <div className="dv-no-results">Nenhum intermediário encontrado</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroProduto;