import React, { useState, useEffect } from 'react';
import './CadastroProduto.css';

const CadastroProduto = () => {
  const [vendedor, setVendedor] = useState({ nome: 'Usuário' });
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
  const [intermediariosSelecionados, setIntermediariosSelecionados] = useState(['Bruno Silva', 'Ana Costa']);
  const [imagens, setImagens] = useState([]);
  const [previewImagens, setPreviewImagens] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [novoIntermediario, setNovoIntermediario] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [buscaIntermediarios, setBuscaIntermediarios] = useState('');
  const [showAlert, setShowAlert] = useState({ show: false, title: '', message: '', type: 'info' });

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

  const limparFormulario = () => {
    const btn = document.getElementById('limparBtn');
    if (btn) {
      btn.style.transition = 'all 0.2s';
      btn.style.backgroundColor = '#2563eb';
      btn.style.color = 'white';
      setTimeout(() => {
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 300);
    }
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
    mostrarAlerta('Formulário limpo', 'Todos os campos foram resetados!', 'success');
  };

  const salvarRascunho = () => {
    const btn = document.getElementById('rascunhoBtn');
    if (btn) {
      btn.style.transition = 'all 0.2s';
      btn.style.backgroundColor = '#cbd5e1';
      setTimeout(() => {
        btn.style.backgroundColor = '';
      }, 300);
    }
    const rascunho = { produto, comissao, avaliacaoMinima, intermediariosSelecionados, imagens: imagens.length };
    localStorage.setItem('blink_rascunho_produto', JSON.stringify(rascunho));
    mostrarAlerta('Rascunho salvo', 'Produto salvo como rascunho!', 'success');
  };

  const publicarProduto = () => {
    const btn = document.getElementById('publicarBtn');
    if (btn) {
      btn.style.transition = 'all 0.2s';
      btn.style.backgroundColor = '#1d4ed8';
      setTimeout(() => {
        btn.style.backgroundColor = '';
      }, 300);
    }
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
    mostrarAlerta('Sucesso!', `"${produto.nome}" foi publicado!`, 'success');
    localStorage.removeItem('blink_rascunho_produto');
  };

  useEffect(() => {
    const vendedorLogado = localStorage.getItem('vendedorLogado');
    if (vendedorLogado) setVendedor(JSON.parse(vendedorLogado));
    const rascunho = localStorage.getItem('blink_rascunho_produto');
    if (rascunho) {
      const data = JSON.parse(rascunho);
      if (data.produto) {
        setProduto(data.produto);
        setComissao(data.comissao);
        setAvaliacaoMinima(data.avaliacaoMinima);
        if (data.intermediariosSelecionados) setIntermediariosSelecionados(data.intermediariosSelecionados);
        mostrarAlerta('Rascunho encontrado', `Rascunho de "${data.produto.nome || 'produto'}" carregado.`, 'info');
      }
    }
  }, []);

  return (
    <div className="container">
      {showAlert.show && (
        <div className={`custom-alert ${showAlert.type}`}>
          <i className={`fas ${showAlert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <div className="alert-content">
            <div className="alert-title">{showAlert.title}</div>
            <div className="alert-message">{showAlert.message}</div>
          </div>
          <i className="fas fa-times close-alert" onClick={() => setShowAlert({ show: false })}></i>
        </div>
      )}

      {/* APP BAR NORMAL */}
      <div className="appbar">
        <div className="appbar-left">
          <i className="fas fa-link appbar-logo-icon"></i>
          <span className="appbar-logo">Blink</span>
        </div>
        <div className="appbar-right">
          <i className="fas fa-bell appbar-icon"></i>
          <div className="appbar-user">
            <i className="fas fa-user-circle"></i>
            <span>{vendedor.nome}</span>
          </div>
        </div>
      </div>

      <div className="product-grid">
        {/* COLUNA ESQUERDA */}
        <div>
          <div className="card">
            <div className="card-title"><i className="fas fa-info-circle"></i> Informações Básicas</div>
            <div className="form-group">
              <label>NOME DO PRODUTO</label>
              <input type="text" name="nome" className="form-control" value={produto.nome} onChange={handleInputChange} placeholder="Ex: Câmera Sony" />
            </div>
            <div className="row-2col">
              <div className="form-group">
                <label>CATEGORIA</label>
                <select name="categoria" className="form-control" value={produto.categoria} onChange={handleInputChange}>
                  <option>Eletrônicos</option><option>Moda</option><option>Casa & Decoração</option>
                  <option>Esportes</option><option>Livros</option><option>Automotivo</option>
                  <option>Outros</option>
                </select>
              </div>
              <div className="form-group">
                <label>SUBCATEGORIA</label>
                <input type="text" name="subcategoria" className="form-control" value={produto.subcategoria} onChange={handleInputChange} placeholder="Ex: Câmeras" />
              </div>
            </div>
            <div className="condition-section">
              <div className="condition-title">CONDIÇÃO</div>
              <div className="condition-row">
                <div className={`condition-card ${produto.condicao === 'Novo' ? 'selected' : ''}`} onClick={() => handleCondicaoChange('Novo')}>
                  <input type="radio" checked={produto.condicao === 'Novo'} readOnly /><label>Novo</label>
                </div>
                <div className={`condition-card ${produto.condicao === 'Usado' ? 'selected' : ''}`} onClick={() => handleCondicaoChange('Usado')}>
                  <input type="radio" checked={produto.condicao === 'Usado'} readOnly /><label>Usado</label>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title"><i className="fas fa-images"></i> Imagens</div>
            <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Arraste suas fotos aqui<br />ou clique para selecionar do computador</p>
              <input type="file" id="fileInput" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImagemUpload} />
            </div>
            <div className="preview-imgs">
              {previewImagens.map((src, idx) => (
                <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={src} className="preview-img" alt="Preview" />
                  <span className="remove-img" onClick={() => removerImagem(idx)}><i className="fas fa-times"></i></span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title"><i className="fas fa-tag"></i> Detalhes e Preço</div>
            <div className="form-group">
              <label>PREÇO DE VENDA (MZM)</label>
              <input type="number" name="preco" className="form-control" value={produto.preco} onChange={handleInputChange} placeholder="0,00" step="any" />
            </div>
            <div className="form-group">
              <label>PROVÍNCIA / CIDADE</label>
              <input type="text" name="provincia" className="form-control" value={produto.provincia} onChange={handleInputChange} placeholder="Ex: Maputo" />
            </div>
            <div className="form-group">
              <label>DESCRIÇÃO DETALHADA</label>
              <textarea name="descricao" className="form-control" rows="4" value={produto.descricao} onChange={handleInputChange} placeholder="Descrição do produto..."></textarea>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div>
          <div className="card">
            <div className="card-title"><i className="fas fa-user-cog"></i> Configurações de Intermediário</div>
            
            <div className="toggle-switch-wrapper">
              <span><i className="fas fa-globe"></i> Permitir qualquer intermediário</span>
              <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
            </div>

            <div className="form-group">
              <label>COMISSÃO</label>
              <div className="comissao-row">
                <span>Percentual sobre venda</span>
                <div className="comissao-input-area">
                  <input type="number" value={comissao} onChange={(e) => setComissao(parseFloat(e.target.value))} step="0.5" />
                  <span className="percent-traco">%</span>
                </div>
              </div>
              <small className="field-hint">A comissão média nesta categoria em Moçambique é de 4-7%.</small>
            </div>

            <div className="form-group">
              <label>AVALIAÇÃO MÍNIMA</label>
              <div className="avaliacao-buttons">
                {['1.0', '2.5', '4.0', '4.5', '5.0'].map(nota => (
                  <div key={nota} className={`avaliacao-btn ${avaliacaoMinima === nota ? 'selected' : ''}`} onClick={() => setAvaliacaoMinima(nota)}>{nota}</div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>INTERMEDIÁRIOS SELECIONADOS</label>
              <div className="intermediarios-container">
                {intermediariosSelecionados.map(nome => (
                  <div key={nome} className="intermediario-tag selected">
                    <i className="fas fa-user-circle"></i> {nome}
                    <i className="fas fa-times-circle" onClick={() => removerIntermediario(nome)}></i>
                  </div>
                ))}
              </div>
              <div className="add-intermediario">
                <input type="text" placeholder="Nome do intermediário" value={novoIntermediario} onChange={(e) => setNovoIntermediario(e.target.value)} />
                <button onClick={adicionarIntermediarioManual}><i className="fas fa-plus"></i> Adicionar</button>
              </div>
              <div className="buscar-link" onClick={() => setShowModal(true)}><i className="fas fa-search"></i> + Buscar</div>
            </div>
          </div>

          <div className="resumo-card">
            <div className="card-title"><i className="fas fa-chart-line"></i> RESUMO DA VENDA</div>
            <div className="resumo-linha"><span>Preço Bruto</span><span>{precoBruto.toFixed(2)} MZM</span></div>
            <div className="resumo-linha"><span>Comissão Intern. ({comissao}%)</span><span>{comissaoValor.toFixed(2)} MZM</span></div>
            <div className="resumo-linha"><span>Taxa Marketplace</span><span>{taxaValor.toFixed(2)} MZM</span></div>
            <div className="resumo-linha total"><span><strong>Recebimento Estimado</strong></span><span><strong>{recebimentoEstimado.toFixed(2)} MZM</strong></span></div>
          </div>

          <div className="preview-card">
            <div className="card-title"><i className="fas fa-eye"></i> Pré-visualização do Produto</div>
            <div className="product-preview">
              <div className="preview-image">
                {previewImage ? (
                  <img src={previewImage} alt="Pré-visualização" />
                ) : (
                  <div className="no-image">
                    <i className="fas fa-image"></i>
                    <span>Sem imagem</span>
                  </div>
                )}
              </div>
              <div className="preview-info">
                <h3>{produto.nome || "Nome do produto"}</h3>
                <p className="preview-price">{precoBruto.toFixed(2)} MZM</p>
                <p className="preview-description">
                  {produto.descricao ? produto.descricao.substring(0, 80) + "..." : "Descrição do produto..."}
                </p>
                <div className="preview-category"><i className="fas fa-tag"></i> {produto.categoria}</div>
                <div className="preview-condition"><i className="fas fa-box"></i> {produto.condicao}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <div className="action-buttons">
          <button id="limparBtn" className="btn btn-outline" onClick={limparFormulario}>
            <i className="fas fa-eraser"></i> Limpar Formulário
          </button>
          <button id="rascunhoBtn" className="btn btn-secondary" onClick={salvarRascunho}>
            <i className="fas fa-save"></i> Salvar como Rascunho
          </button>
          <button id="publicarBtn" className="btn btn-primary" onClick={publicarProduto}>
            <i className="fas fa-rocket"></i> Publicar Produto
          </button>
        </div>
      </div>

      <div className="footer">
        <div className="footer-grid">
          <div className="footer-col"><h4><i className="fas fa-globe"></i> PLATAFORMA</h4><p>Sobre</p><p>Como Funciona</p><p>Taxas</p><p>Segurança</p></div>
          <div className="footer-col"><h4><i className="fas fa-headset"></i> SUPORTE</h4><p>FAQ</p><p>Contacto</p><p>Ouvidoria</p><p>Chat Online</p></div>
          <div className="footer-col"><h4><i className="fas fa-gavel"></i> LEGAL</h4><p>Termos de Uso</p><p>Privacidade</p><p>Cookies</p><p>LGPD</p></div>
          <div className="footer-col"><h4><i className="fas fa-handshake"></i> BLINK</h4><p>A maior plataforma de intermediação segura de produtos premium em Moçambique.</p><p><i className="fas fa-envelope"></i> apoio@blink.mz</p><p><i className="fas fa-phone"></i> +258 84 123 4567</p></div>
        </div>
        <div className="footer-bottom">© 2026 Blink Moçambique. Todos os direitos reservados.</div>
      </div>

      {showModal && (
        <div className="modal active" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3><i className="fas fa-search"></i> Buscar Intermediários</h3><i className="fas fa-times close-modal" onClick={() => setShowModal(false)}></i></div>
            <div className="modal-search"><input type="text" placeholder="Digite o nome..." value={buscaIntermediarios} onChange={(e) => setBuscaIntermediarios(e.target.value)} /></div>
            <div className="modal-results">
              {intermediariosFiltrados.map(inter => (
                <div key={inter.id} className="search-result-item">
                  <div className="result-info"><i className="fas fa-user-circle"></i><div><strong>{inter.nome}</strong> <span className="result-rating"><i className="fas fa-star"></i> {inter.avaliacao}</span></div></div>
                  <button className="btn-add-result" onClick={() => adicionarIntermediario(inter.nome)}>Adicionar</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroProduto;