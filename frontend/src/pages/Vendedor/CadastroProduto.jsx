import React, { useState, useEffect } from 'react';
import './CadastroProduto.css';

const CadastroProduto = () => {
  // Dados do vendedor logado (vem do localStorage)
  const [vendedor, setVendedor] = useState({ nome: 'Usuário' });

  // Estado do formulário
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
  const [taxaMarketplace] = useState(2); // 2% exemplo
  const [intermediariosSelecionados, setIntermediariosSelecionados] = useState(['Bruno Silva', 'Ana Costa']);
  const [imagens, setImagens] = useState([]);
  const [previewImagens, setPreviewImagens] = useState([]);
  const [novoIntermediario, setNovoIntermediario] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [buscaIntermediarios, setBuscaIntermediarios] = useState('');
  const [showAlert, setShowAlert] = useState({ show: false, title: '', message: '', type: 'info' });

  // Lista de intermediários disponíveis (mock)
  const intermediariosDisponiveis = [
    { id: 1, nome: "Carlos Mendes", email: "carlos@blink.mz", telefone: "84 123 4567", avaliacao: 4.8, cidade: "Maputo" },
    { id: 2, nome: "Maria João", email: "maria@blink.mz", telefone: "85 234 5678", avaliacao: 4.9, cidade: "Matola" },
    { id: 3, nome: "Paulo Santos", email: "paulo@blink.mz", telefone: "86 345 6789", avaliacao: 4.7, cidade: "Beira" },
    { id: 4, nome: "Fernanda Lima", email: "fernanda@blink.mz", telefone: "87 456 7890", avaliacao: 5.0, cidade: "Nampula" },
  ];

  // Cálculos do resumo da venda
  const precoBruto = parseFloat(produto.preco) || 0;
  const comissaoValor = (precoBruto * comissao) / 100;
  const taxaValor = (precoBruto * taxaMarketplace) / 100;
  const recebimentoEstimado = precoBruto - comissaoValor - taxaValor;

  // Handlers
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
          mostrarAlerta('Imagem adicionada', `${file.name} foi adicionada`, 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removerImagem = (index) => {
    setImagens(imagens.filter((_, i) => i !== index));
    setPreviewImagens(previewImagens.filter((_, i) => i !== index));
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
    mostrarAlerta('Formulário limpo', 'Todos os campos foram resetados!', 'success');
  };

  const salvarRascunho = () => {
    const rascunho = { produto, comissao, avaliacaoMinima, intermediariosSelecionados, imagens: imagens.length };
    localStorage.setItem('blink_rascunho_produto', JSON.stringify(rascunho));
    mostrarAlerta('Rascunho salvo', 'Produto salvo como rascunho!', 'success');
  };

  const publicarProduto = () => {
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

  const voltar = () => window.history.back();

  // Carregar rascunho e dados do vendedor
  useEffect(() => {
    const vendedorLogado = localStorage.getItem('vendedorLogado');
    if (vendedorLogado) {
      setVendedor(JSON.parse(vendedorLogado));
    }
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
      {/* Alert */}
      {showAlert.show && (
        <div className={`custom-alert ${showAlert.type}`}>
          <i className={`fas ${showAlert.type === 'success' ? 'fa-check-circle' : showAlert.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          <div className="alert-content">
            <div className="alert-title">{showAlert.title}</div>
            <div className="alert-message">{showAlert.message}</div>
          </div>
          <i className="fas fa-times close-alert" onClick={() => setShowAlert({ show: false })}></i>
        </div>
      )}

      {/* Barra superior igual ao wireframe */}
      <div className="top-bar-wireframe">
        <div className="top-bar-left">
          <button className="btn-close" onClick={voltar}>
            <i className="fas fa-times"></i>
          </button>
          <h2 className="page-title">Adicionar Novo Produto</h2>
        </div>
        <div className="user-area">
          <div className="user-badge">
            <i className="fas fa-store"></i>
            <span>Olá, {vendedor.nome}</span>
          </div>
          <i className="fas fa-bell"></i>
        </div>
      </div>

      <div className="product-grid">
        {/* COLUNA ESQUERDA */}
        <div>
          {/* Informações Básicas */}
          <div className="card">
            <div className="card-title">
              <i className="fas fa-info-circle"></i> Informações Básicas
            </div>
            <div className="form-group">
              <label>NOME DO PRODUTO</label>
              <input type="text" name="nome" className="form-control" value={produto.nome} onChange={handleInputChange} placeholder="Ex: Câmera Mirrorless Sony Alpha A7 III" />
            </div>
            <div className="row-2col">
              <div className="form-group">
                <label>CATEGORIA</label>
                <select name="categoria" className="form-control" value={produto.categoria} onChange={handleInputChange}>
                  <option>Eletrônicos</option>
                  <option>Moda</option>
                  <option>Casa & Decoração</option>
                  <option>Esportes</option>
                  <option>Livros</option>
                  <option>Automotivo</option>
                  <option>Saúde & Beleza</option>
                  <option>Brinquedos</option>
                  <option>Alimentos & Bebidas</option>
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
                  <input type="radio" name="condicao" value="Novo" checked={produto.condicao === 'Novo'} readOnly />
                  <label>Novo</label>
                </div>
                <div className={`condition-card ${produto.condicao === 'Usado' ? 'selected' : ''}`} onClick={() => handleCondicaoChange('Usado')}>
                  <input type="radio" name="condicao" value="Usado" checked={produto.condicao === 'Usado'} readOnly />
                  <label>Usado</label>
                </div>
              </div>
            </div>
          </div>

          {/* Imagens */}
          <div className="card">
            <div className="card-title">
              <i className="fas fa-images"></i> Imagens
            </div>
            <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Arraste suas fotos aqui<br />ou clique para selecionar do computador</p>
              <input type="file" id="fileInput" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImagemUpload} />
            </div>
            <div className="preview-imgs">
              {previewImagens.map((src, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={src} className="preview-img" alt="Preview" />
                  <span className="remove-img" onClick={() => removerImagem(idx)}><i className="fas fa-times"></i></span>
                </div>
              ))}
            </div>
            <div className="add-images-hint">
              <i className="fas fa-plus-circle"></i> ADICIONAR IMAGENS
            </div>
          </div>

          {/* Detalhes e Preço */}
          <div className="card">
            <div className="card-title">
              <i className="fas fa-tag"></i> Detalhes e Preço
            </div>
            <div className="form-group">
              <label>PREÇO DE VENDA (MZM)</label>
              <input type="number" name="preco" className="form-control" value={produto.preco} onChange={handleInputChange} placeholder="0,00" step="any" />
            </div>
            <div className="form-group">
              <label>PROVÍNCIA / CIDADE</label>
              <input type="text" name="provincia" className="form-control" value={produto.provincia} onChange={handleInputChange} placeholder="Ex: Maputo, Cidade" />
            </div>
            <div className="form-group">
              <label>DESCRIÇÃO DETALHADA</label>
              <textarea name="descricao" className="form-control" rows="4" value={produto.descricao} onChange={handleInputChange} placeholder="Descreva as principais características, estado de conservação e o que está incluído no pacote..."></textarea>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div>
          {/* Configurações de Intermediário */}
          <div className="card">
            <div className="card-title">
              <i className="fas fa-user-cog"></i> Configurações de Intermediário
            </div>

            <div className="toggle-switch-wrapper">
              <span><i className="fas fa-globe"></i> Permitir qualquer intermediário</span>
              <label className="switch">
                <input type="checkbox" checked={true} onChange={() => {}} />
                <span className="slider"></span>
              </label>
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
                  <div key={nota} className={`avaliacao-btn ${avaliacaoMinima === nota ? 'selected' : ''}`} onClick={() => setAvaliacaoMinima(nota)}>
                    {nota}
                  </div>
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
              <div className="buscar-link" onClick={() => setShowModal(true)}>
                <i className="fas fa-search"></i> + Buscar
              </div>
            </div>
          </div>

          {/* Resumo da Venda */}
          <div className="card resumo-card">
            <div className="card-title">
              <i className="fas fa-chart-line"></i> RESUMO DA VENDA
            </div>
            <div className="resumo-linha">
              <span>Preço Bruto</span>
              <span>{precoBruto.toFixed(2)} MZM</span>
            </div>
            <div className="resumo-linha">
              <span>Comissão Intern. ({comissao}%)</span>
              <span>{comissaoValor.toFixed(2)} MZM</span>
            </div>
            <div className="resumo-linha">
              <span>Taxa Marketplace</span>
              <span>{taxaValor.toFixed(2)} MZM</span>
            </div>
            <div className="resumo-linha total">
              <span><strong>Recebimento Estimado</strong></span>
              <span><strong>{recebimentoEstimado.toFixed(2)} MZM</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="action-buttons-container">
        <div className="action-buttons">
          <button className="btn btn-outline" onClick={limparFormulario}><i className="fas fa-eraser"></i> Limpar Formulário</button>
          <button className="btn btn-secondary" onClick={salvarRascunho}><i className="fas fa-save"></i> Salvar como Rascunho</button>
          <button className="btn btn-primary" onClick={publicarProduto}><i className="fas fa-rocket"></i> Publicar Produto</button>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4><i className="fas fa-globe"></i> PLATAFORMA</h4>
            <p>Sobre</p>
            <p>Como Funciona</p>
            <p>Taxas</p>
            <p>Segurança</p>
          </div>
          <div className="footer-col">
            <h4><i className="fas fa-headset"></i> SUPORTE</h4>
            <p>FAQ</p>
            <p>Contacto</p>
            <p>Ouvidoria</p>
            <p>Chat Online</p>
          </div>
          <div className="footer-col">
            <h4><i className="fas fa-gavel"></i> LEGAL</h4>
            <p>Termos de Uso</p>
            <p>Privacidade</p>
            <p>Cookies</p>
            <p>LGPD</p>
          </div>
          <div className="footer-col">
            <h4><i className="fas fa-handshake"></i> BLINK</h4>
            <p>A maior plataforma de intermediação segura de produtos premium em Moçambique.</p>
            <p><i className="fas fa-envelope"></i> apoio@blink.mz</p>
            <p><i className="fas fa-phone"></i> +258 84 123 4567</p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Blink Moçambique. Todos os direitos reservados.</div>
      </div>

      {/* Modal de busca de intermediários */}
      {showModal && (
        <div className="modal active" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-search"></i> Buscar Intermediários</h3>
              <i className="fas fa-times close-modal" onClick={() => setShowModal(false)}></i>
            </div>
            <div className="modal-search">
              <input type="text" placeholder="Digite o nome, email ou telefone..." value={buscaIntermediarios} onChange={(e) => setBuscaIntermediarios(e.target.value)} autoFocus />
            </div>
            <div className="modal-results">
              {intermediariosFiltrados.length === 0 ? (
                <div className="no-results"><i className="fas fa-user-slash"></i><p>Nenhum intermediário encontrado</p></div>
              ) : (
                intermediariosFiltrados.map(inter => (
                  <div key={inter.id} className="search-result-item">
                    <div className="result-info">
                      <i className="fas fa-user-circle"></i>
                      <div>
                        <div><strong>{inter.nome}</strong> <span className="result-rating"><i className="fas fa-star"></i> {inter.avaliacao}</span></div>
                        <small>{inter.email} • {inter.telefone} • {inter.cidade}</small>
                      </div>
                    </div>
                    <button className={`btn-add-result ${intermediariosSelecionados.includes(inter.nome) ? 'disabled' : ''}`} onClick={() => adicionarIntermediario(inter.nome)}>
                      {intermediariosSelecionados.includes(inter.nome) ? <><i className="fas fa-check"></i> Adicionado</> : <><i className="fas fa-plus"></i> Adicionar</>}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroProduto;