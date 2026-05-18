import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../Intermediario/ListagemIntermediarios.css";

export default function ListarIntermediarios() {
  const [intermediarios, setIntermediarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchIntermediarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      const data = await api.intermediariosAPI.listarIntermediarios(token);

      if (data && data.error) {
        setError(data.message || "Erro ao buscar intermediários");
        if (data.status === 401 || data.status === 403) {
          navigate("/auth");
        }
        return;
      }

      console.log("Intermediários recebidos:", data);
      setIntermediarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar intermediários:", err);
      setError("Erro ao conectar ao servidor. Verifique a sua ligação.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntermediarios();
  }, []);

  const handleVerPerfil = (id) => {
    navigate(`/perfil/intermediario/${id}`);
  };

  const handleWhatsApp = (telefone, nome) => {
    const numero = telefone?.replace(/\D/g, "") || "";
    const mensagem = `Olá ${nome}, vi seu perfil no BLINK e gostaria de negociar.`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank");
  };

  const renderStars = (avaliacao) => {
    const fullStars = Math.floor(avaliacao);
    const hasHalfStar = avaliacao % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span style={{ color: "#f6ad55", fontSize: 14 }}>
        {"★".repeat(fullStars)}
        {hasHalfStar && "½"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <div className="spinner"></div>
        <p>Carregando intermediários...</p>
        <style>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top-color: #2d4a6e;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <p style={{ color: "#e53e3e" }}>Erro: {error}</p>
        <button onClick={fetchIntermediarios} style={{
          marginTop: 16,
          padding: "8px 16px",
          background: "#2d4a6e",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="listagem-container">
      {/* Cabeçalho adaptado ao CSS */}
      <div className="header-intermediarios">
        <div>
          <h1 className="page-title">Intermediários</h1>
          <p style={{ color: "#5a6e7c", marginTop: 4 }}>
            {intermediarios.length} intermediário(s) disponível(is) para intermediação
          </p>
        </div>
      </div>

      {/* Filtros adaptados ao CSS */}
      <div className="filtros-bar">
        <div className="filtro-item">
          <span className="filtro-label">Ordenar por</span>
          <select className="filtro-select">
            <option>Melhor Avaliado</option>
            <option>Mais Vendas</option>
            <option>Mais Experiência</option>
          </select>
        </div>
        <div className="filtro-item">
          <span className="filtro-label">Localização</span>
          <select className="filtro-select">
            <option>Todas</option>
            <option>Maputo</option>
            <option>Beira</option>
            <option>Nampula</option>
          </select>
        </div>
        <div className="filtro-item">
          <span className="filtro-label">Avaliação mínima</span>
          <select className="filtro-select">
            <option>Qualquer</option>
            <option>4+ estrelas</option>
            <option>4.5+ estrelas</option>
          </select>
        </div>
      </div>

      {/* Lista de Intermediários */}
      {intermediarios.length === 0 ? (
        <div className="lista-fechada-mensagem">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#1a2a3a", marginTop: 16 }}>
            Nenhum intermediário encontrado
          </p>
          <p style={{ color: "#5a6e7c", fontSize: 14 }}>
            Não há intermediários cadastrados no momento.
          </p>
        </div>
      ) : (
        <div className="intermediarios-grid">
          {intermediarios.map((inter) => (
            <div
              key={inter.id}
              className="intermediario-card"
              onClick={() => handleVerPerfil(inter.id)}
            >
              <div className="card-layout">

                {/* Coluna da foto (Esquerda) */}
                <div className="card-foto-coluna">
                  <div style={{
                    width: 90,
                    height: 90,
                    borderRadius: "20px",
                    background: "#005a4c",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    fontWeight: "bold",
                    margin: "0 auto 0.5rem"
                  }}>
                    {inter.nome?.charAt(0).toUpperCase() || "I"}
                  </div>
                  <div className="card-nome-esquerda">{inter.nome}</div>
                  <div className="avaliacao-esquerda">
                    <div className="avaliacao-nota">
                      {renderStars(inter.avaliacao || 4.5)}
                    </div>
                    <div className="reviews-count">({inter.total_avaliacoes || 0} reviews)</div>
                  </div>
                </div>

                {/* Coluna do conteúdo (Direita) */}
                <div className="card-conteudo-coluna">
                  <div className="especialidades">
                    <span className="especialidade-tag">
                      {inter.avaliacao >= 4.8 ? "EXPERT" : "INTERMEDIÁRIO"}
                    </span>
                    <span className="especialidade-tag" style={{ background: "#eef2f6", color: "#5a6e7c" }}>
                      📍 {inter.cidade || "Moçambique"}
                    </span>
                  </div>

                  <p className="card-descricao">
                    {inter.descricao || "Profissional dedicado a encontrar as melhores oportunidades de negócio para seus clientes."}
                  </p>

                  {/* Estatísticas (Mapeadas para o Grid Fosco do CSS) */}
                  <div className="stats-container">
                    <div className="stat-card-fosco">
                      <div>
                        <span className="stat-valor">{inter.total_vendas || 0}</span>
                        <span className="stat-rotulo">VENDAS</span>
                      </div>
                    </div>
                    <div className="stat-card-fosco">
                      <div>
                        <span className="stat-valor">{inter.experiencia || "2 Anos"}</span>
                        <span className="stat-rotulo">EXPERIÊNCIA</span>
                      </div>
                    </div>
                    <div className="stat-card-fosco">
                      <div>
                        <span className="stat-valor">
                          MZN {inter.ticket_medio?.toLocaleString() || "5.000"}
                        </span>
                        <span className="stat-rotulo">TICKET MÉDIO</span>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Acção */}
                  <div className="card-buttons">
                    <button
                      className="btn-whatsapp"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsApp(inter.telefone, inter.nome);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      Negociar via WhatsApp
                    </button>
                    <button
                      className="btn-perfil"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerPerfil(inter.id);
                      }}
                    >
                      Ver Perfil Completo
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}