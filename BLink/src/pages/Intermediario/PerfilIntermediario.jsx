import React, { useState } from 'react';
import './PerfilIntermediario.css';

const PerfilIntermediario = () => {
  const [fotoPerfil, setFotoPerfil] = useState('https://randomuser.me/api/portraits/men/15.jpg');
  const [novaEspecialidade, setNovaEspecialidade] = useState('');
  const [especialidades, setEspecialidades] = useState(['Eletrônicos', 'Smart Home', 'Gadgets', 'Hardware']);
  
  const [stats, setStats] = useState({
    produtos: 42,
    taxaResposta: 98,
    vendas: 850,
    media: 4.9
  });

  const adicionarEspecialidade = () => {
    if (novaEspecialidade.trim()) {
      setEspecialidades([...especialidades, novaEspecialidade]);
      setNovaEspecialidade('');
    }
  };

  const removerEspecialidade = (index) => {
    setEspecialidades(especialidades.filter((_, i) => i !== index));
  };

  const trocarFoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setFotoPerfil(ev.target.result);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const aumentarEstatisticas = () => {
    setStats({
      produtos: stats.produtos + 1,
      taxaResposta: Math.min(100, stats.taxaResposta + 0.5),
      vendas: stats.vendas + 1,
      media: parseFloat((stats.media + 0.01).toFixed(1))
    });
  };

  const voltar = () => {
    window.history.back();
  };

  const produtos = [
    { id: 1, nome: "Fone de Ouvido Hi-Fi Pro", descricao: "Cancelamento de ruído ativo e 40h de bateria.", preco: 12990, imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150" },
    { id: 2, nome: "Smartwatch Series X", descricao: "Monitoramento de saúde completo e tela AMOLED.", preco: 8490, imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150" },
    { id: 3, nome: "Caixa de Som Bluetooth", descricao: "Som premium e resistência à água IP67.", preco: 4990, imagem: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=150" }
  ];

  const avaliacoes = [
    { id: 1, nome: "Mariana Silva", foto: "https://randomuser.me/api/portraits/women/1.jpg", data: "15 de Abril, 2026", estrelas: 5, comentario: "Ricardo foi super atencioso durante todo o processo. O fone chegou impecável em Maputo e ele tirou todas as minhas dúvidas sobre a garantia. Recomendo muito!" },
    { id: 2, nome: "Carlos Eduardo", foto: "https://randomuser.me/api/portraits/men/2.jpg", data: "10 de Abril, 2026", estrelas: 4, comentario: "Ótima experiência de compra. Atendimento rápido e eficiente para entregas locais." },
    { id: 3, nome: "Ana Beatriz", foto: "https://randomuser.me/api/portraits/women/3.jpg", data: "5 de Abril, 2026", estrelas: 5, comentario: "Produto de excelente qualidade. O intermediário respondeu rapidamente e a entrega foi dentro do prazo." }
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <div className="stars-container">
        {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
      </div>
    );
  };

  return (
    <div className="perfil-page">
      {/* Barra superior com X */}
      <div className="top-bar">
        <div className="top-bar-left">
          <button className="btn-sair" onClick={voltar}>
            <i className="fas fa-times"></i>
          </button>
          <span className="logo">BLINK</span>
        </div>
        <div className="top-bar-center">
          <a href="#">Categorias</a>
          <a href="#">Como Funciona</a>
          <a href="#">Seja Intermediário</a>
        </div>
        <div className="top-bar-right">
          <a href="#">Login</a>
          <a href="#" className="btn-registrar">Registrar</a>
        </div>
      </div>

      <div className="perfil-container">
        {/* Card Principal do Perfil - FOTO ESQUERDA / INFO DIREITA */}
        <div className="perfil-header-card">
          <div className="perfil-foto">
            <img src={fotoPerfil} alt="Perfil" />
            <button className="btn-trocar-foto" onClick={trocarFoto}>
              <i className="fas fa-camera"></i>
            </button>
          </div>
          <div className="perfil-info-container">
            <h2>Ricardo Almeida</h2>
            <div className="verificado-container">
              <i className="fas fa-check-circle"></i> VERIFICADO
            </div>
            <div className="avaliacao-wrapper">
              {renderStars(4.9)}
              <span className="avaliacao-texto">4.9 (128 avaliações)</span>
            </div>
            <p className="perfil-local"><i className="fas fa-map-marker-alt"></i> Maputo, Moçambique</p>
            <p className="perfil-membro"><i className="fas fa-calendar-alt"></i> Membro desde 2026</p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-boxes"></i></div>
            <div>
              <span className="stat-valor">{stats.produtos}</span>
              <small>PRODUTOS</small>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-clock"></i></div>
            <div>
              <span className="stat-valor">{stats.taxaResposta}%</span>
              <small>TAXA RESPOSTA</small>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-shopping-cart"></i></div>
            <div>
              <span className="stat-valor">{stats.vendas}+</span>
              <small>VENDAS</small>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-star"></i></div>
            <div>
              <span className="stat-valor">{stats.media}</span>
              <small>MÉDIA</small>
            </div>
          </div>
        </div>

        {/* Botão para testar crescimento */}
        <div className="teste-crescimento">
          <button onClick={aumentarEstatisticas} className="btn-simular-venda">
            <i className="fas fa-chart-line"></i> Simular Nova Venda
          </button>
        </div>

        {/* Layout de 2 colunas */}
        <div className="two-columns">
          <div className="left-column">
            <div className="sobre-card">
              <h3><i className="fas fa-user-astronaut"></i> Sobre</h3>
              <p>Especialista em produtos eletrônicos e tecnologia com mais de 5 anos de experiência no mercado de intermediação em Moçambique. Focado em garantir a melhor experiência de compra e suporte pós-venda para meus clientes.</p>
            </div>

            <div className="especialidades-card">
              <h3><i className="fas fa-cogs"></i> ESPECIALIDADES</h3>
              <div className="tags">
                {especialidades.map((esp, idx) => (
                  <span key={idx} className="tag">
                    {esp}
                    <button className="remover-especialidade" onClick={() => removerEspecialidade(idx)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
                <div className="add-especialidade">
                  <input 
                    type="text" 
                    placeholder="Nova especialidade" 
                    value={novaEspecialidade} 
                    onChange={(e) => setNovaEspecialidade(e.target.value)} 
                  />
                  <button onClick={adicionarEspecialidade}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="produtos-card">
              <h3><i className="fas fa-boxes"></i> Produtos Representados</h3>
              <p className="subtitulo">Ofertas exclusivas gerenciadas por este perfil</p>
              <div className="produtos-grid">
                {produtos.map(prod => (
                  <div className="produto-card-telefone" key={prod.id}>
                    <div className="produto-imagem-telefone">
                      <img src={prod.imagem} alt={prod.nome} />
                    </div>
                    <div className="produto-info-telefone">
                      <h4>{prod.nome}</h4>
                      <p className="produto-descricao-telefone">{prod.descricao}</p>
                      <span className="produto-preco-telefone">{prod.preco.toLocaleString()} MZM</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Avaliações e Contato */}
        <div className="two-columns-bottom">
          <div className="avaliacoes-card">
            <h3><i className="fas fa-star"></i> Avaliações Recentes</h3>
            {avaliacoes.map(av => (
              <div className="avaliacao-item" key={av.id}>
                <div className="avaliacao-foto">
                  <img src={av.foto} alt={av.nome} />
                </div>
                <div className="avaliacao-conteudo">
                  <div className="avaliacao-header">
                    <strong>{av.nome}</strong>
                    <span className="avaliacao-data">{av.data}</span>
                  </div>
                  {renderStars(av.estrelas)}
                  <p className="avaliacao-texto-completo">{av.comentario}</p>
                </div>
              </div>
            ))}
            <button className="btn-ver-mais">Ver mais avaliações <i className="fas fa-arrow-right"></i></button>
          </div>

          <div className="contato-card">
            <h3><i className="fas fa-phone-alt"></i> Contato Direto</h3>
            <div className="contato-buttons">
              <a href="#" className="btn-whatsapp">
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
              <a href="#" className="btn-ligar">
                <i className="fas fa-phone"></i> Ligar Agora
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="rodape">
        <div className="rodape-grid">
          <div className="rodape-col">
            <h4>Marketplace</h4>
            <p>A maior plataforma de intermediação de vendas em Moçambique com foco em confiança e resultados.</p>
          </div>
          <div className="rodape-col">
            <h4>Empresa</h4>
            <p>Sobre</p><p>FAQ</p><p>Contato</p>
          </div>
          <div className="rodape-col">
            <h4>Legal</h4>
            <p>Termos</p><p>Privacidade</p>
          </div>
          <div className="rodape-col">
            <h4>Newsletter</h4>
            <div className="newsletter-input">
              <input type="email" placeholder="Seu email" />
              <button><i className="fas fa-arrow-right"></i></button>
            </div>
          </div>
        </div>
        <div className="rodape-copyright">
          © 2026 BLink Moçambique. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PerfilIntermediario;