import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListagemIntermediarios.css';

const ListagemIntermediarios = () => {
  const navigate = useNavigate();
  const [intermediarios, setIntermediarios] = useState([]);
  const [ordenacao, setOrdenacao] = useState("Melhor Avaliado");
  const [localizacaoUsuario, setLocalizacaoUsuario] = useState("");
  const [avaliacaoMinima, setAvaliacaoMinima] = useState("4+");
  const [abrirOrdenacao, setAbrirOrdenacao] = useState(false);
  const [abrirAvaliacao, setAbrirAvaliacao] = useState(false);
  const [listaVisivel, setListaVisivel] = useState(true);

  const opcoesOrdenacao = ["Melhor Avaliado", "Mais Vendas", "Maior Experiência", "Menor Ticket", "Maior Ticket"];
  const opcoesAvaliacao = ["1+", "2+", "3+", "4+", "4.5+", "5"];

  const intermediariosData = [
    {
      id: 1,
      nome: "Ricardo Albuquerque",
      especialidades: ["NEGOCIAÇÃO B2B", "TI & SOFTWARE"],
      descricao: "Especialista em intermediação de ativos digitais de alto valor com mais de 8 anos de experiência no mercado de Maputo. Foco em segurança jurídica e transparência no processo de transferência.",
      avaliacao: 4.9,
      reviews: 128,
      nivel: "NÍVEL EXPERT",
      vendas: 542,
      experiencia: 8,
      ticketMedio: 15000,
      local: "Maputo",
      lat: -25.969,
      lng: 32.589,
      foto: "https://randomuser.me/api/portraits/men/32.jpg",
      whatsapp: "258841234567"
    },
    {
      id: 2,
      nome: "Mariana Costa",
      especialidades: ["LICENCIAMENTO", "PROCESSOS"],
      descricao: "Especialista em conformidade e contratos de licenciamento. Atuando em Moçambique desde 2023 para garantir que todos os termos sejam respeitados.",
      avaliacao: 5.0,
      reviews: 42,
      nivel: "ESTRELA ASCENDENTE",
      vendas: 89,
      experiencia: 3,
      ticketMedio: 5000,
      local: "Beira",
      lat: -19.843,
      lng: 34.838,
      foto: "https://randomuser.me/api/portraits/women/68.jpg",
      whatsapp: "258851234567"
    },
    {
      id: 3,
      nome: "Carlos Mendes",
      especialidades: ["VENDAS CORPORATIVAS", "CONSULTORIA"],
      descricao: "Mais de 10 anos auxiliando empresas a fechar negócios de grande porte. Rede de contatos nacional e internacional.",
      avaliacao: 4.8,
      reviews: 95,
      nivel: "NÍVEL PLATINUM",
      vendas: 312,
      experiencia: 10,
      ticketMedio: 32000,
      local: "Matola",
      lat: -25.962,
      lng: 32.458,
      foto: "https://randomuser.me/api/portraits/men/45.jpg",
      whatsapp: "258861234567"
    }
  ];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt`);
            const data = await response.json();
            const cidade = data.address?.city || data.address?.town || data.address?.village || "Maputo";
            setLocalizacaoUsuario(cidade);
          } catch {
            setLocalizacaoUsuario("Maputo");
          }
        },
        () => setLocalizacaoUsuario("Maputo"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocalizacaoUsuario("Maputo");
    }
  }, []);

  useEffect(() => {
    let lista = [...intermediariosData];
    const minRating = parseFloat(avaliacaoMinima);
    if (!isNaN(minRating)) {
      lista = lista.filter(inter => inter.avaliacao >= minRating);
    }
    switch (ordenacao) {
      case "Melhor Avaliado": lista.sort((a, b) => b.avaliacao - a.avaliacao); break;
      case "Mais Vendas": lista.sort((a, b) => b.vendas - a.vendas); break;
      case "Maior Experiência": lista.sort((a, b) => b.experiencia - a.experiencia); break;
      case "Menor Ticket": lista.sort((a, b) => a.ticketMedio - b.ticketMedio); break;
      case "Maior Ticket": lista.sort((a, b) => b.ticketMedio - a.ticketMedio); break;
      default: break;
    }
    setIntermediarios(lista);
  }, [ordenacao, avaliacaoMinima]);

  const abrirWhatsApp = (numero) => {
    window.open(`https://wa.me/${numero}`, '_blank');
  };

  const abrirMapa = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div className="listagem-page">
      {/* Barra superior */}
      <div className="top-bar">
        <div className="top-bar-left">
          <button className="btn-sair" onClick={() => navigate('/')}>
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
          <a href="#" className="btn-login">Login</a>
          <a href="#" className="btn-registrar">Registrar</a>
        </div>
      </div>

      <div className="listagem-container">
        <div className="header-intermediarios">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Perfil" className="foto-perfil-header" />
          <h1 className="page-title">Intermediários</h1>
        </div>

        <div className="filtros-bar">
          <div className="filtro-item">
            <span className="filtro-label">Ordenar por:</span>
            <div className="filtro-select" onClick={() => setAbrirOrdenacao(!abrirOrdenacao)}>
              {ordenacao} <i className="fas fa-chevron-down"></i>
            </div>
            {abrirOrdenacao && (
              <div className="dropdown-menu">
                {opcoesOrdenacao.map(opt => (
                  <div key={opt} className="dropdown-item" onClick={() => { setOrdenacao(opt); setAbrirOrdenacao(false); }}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filtro-item">
            <div className="filtro-chip" onClick={() => abrirMapa(-25.969, 32.589)}>
              <i className="fas fa-map-marker-alt"></i> {localizacaoUsuario || "Buscando..."}
            </div>
          </div>

          <div className="filtro-item">
            <div className="filtro-chip" onClick={() => setAbrirAvaliacao(!abrirAvaliacao)}>
              <i className="fas fa-star"></i> Avaliação mínima: {avaliacaoMinima}
              <i className="fas fa-chevron-down"></i>
            </div>
            {abrirAvaliacao && (
              <div className="dropdown-menu">
                {opcoesAvaliacao.map(val => (
                  <div key={val} className="dropdown-item" onClick={() => { setAvaliacaoMinima(val); setAbrirAvaliacao(false); }}>
                    {val}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="btn-fechar-lista" onClick={() => setListaVisivel(!listaVisivel)}>
            <i className="fas fa-times"></i> Fechar Lista
          </button>
        </div>

        {listaVisivel && (
          <div className="intermediarios-grid">
            {intermediarios.map(inter => (
              <div className="intermediario-card" key={inter.id}>
                <div className="card-layout">
                  <div className="card-foto-coluna">
                    <img src={inter.foto} alt={inter.nome} />
                    <h3 className="card-nome-esquerda">{inter.nome}</h3>
                    <div className="avaliacao-esquerda">
                      <span className="avaliacao-nota">{inter.avaliacao} ★</span>
                      <span className="reviews-count">{inter.reviews} reviews</span>
                    </div>
                  </div>

                  <div className="card-conteudo-coluna">
                    <div className="especialidades">
                      {inter.especialidades.map((esp, idx) => (
                        <span key={idx} className="especialidade-tag">{esp}</span>
                      ))}
                    </div>
                    <p className="card-descricao">{inter.descricao}</p>

                    <div className="stats-container">
                      <div className="stat-card-fosco">
                        <i className="fas fa-chart-line"></i>
                        <div>
                          <span className="stat-valor">{inter.vendas}</span>
                          <span className="stat-rotulo">VENDAS</span>
                        </div>
                      </div>
                      <div className="stat-card-fosco">
                        <i className="fas fa-briefcase"></i>
                        <div>
                          <span className="stat-valor">{inter.experiencia} Anos</span>
                          <span className="stat-rotulo">EXPERIÊNCIA</span>
                        </div>
                      </div>
                      <div className="stat-card-fosco">
                        <i className="fas fa-money-bill-wave"></i>
                        <div>
                          <span className="stat-valor">{inter.ticketMedio.toLocaleString()} MZM</span>
                          <span className="stat-rotulo">TICKET MÉDIO</span>
                        </div>
                      </div>
                      <div className="stat-card-fosco" onClick={() => abrirMapa(inter.lat, inter.lng)}>
                        <i className="fas fa-map-pin"></i>
                        <div>
                          <span className="stat-valor">{inter.local}</span>
                          <span className="stat-rotulo">LOCAL</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-buttons">
                      <button className="btn-whatsapp" onClick={() => abrirWhatsApp(inter.whatsapp)}>
                        <i className="fab fa-whatsapp"></i> Negociar via WhatsApp
                      </button>
                      <button className="btn-perfil" onClick={() => navigate(`/perfil/${inter.id}`)}>
                        Ver Perfil Completo <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!listaVisivel && (
          <div className="lista-fechada-mensagem">
            <p>Lista fechada. <button onClick={() => setListaVisivel(true)}>Abrir lista</button></p>
          </div>
        )}
      </div>

      <footer className="rodape">
        <div className="rodape-grid">
          <div className="rodape-col">
            <h4>BLINK</h4>
            <p>A plataforma líder em intermediação de ativos digitais e software em Moçambique. Segurança e transparência em cada transação.</p>
          </div>
          <div className="rodape-col">
            <h4>Plataforma</h4>
            <p>Sobre</p><p>Como Funciona</p><p>Vantagens</p>
          </div>
          <div className="rodape-col">
            <h4>Suporte</h4>
            <p>FAQ</p><p>Contato</p><p>Status do Sistema</p>
          </div>
          <div className="rodape-col">
            <h4>Legal</h4>
            <p>Termos</p><p>Privacidade</p>
          </div>
        </div>
        <div className="rodape-copyright">
          © 2026 Blink Moçambique. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default ListagemIntermediarios;