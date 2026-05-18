import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function ListarIntermediarios() {
  const [intermediarios, setIntermediarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchIntermediarios = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Recupera o token guardado no localStorage
      const token = localStorage.getItem("accessToken");

      // 2. Chamada adaptada para a estrutura actual do seu ficheiro api.js
      const data = await api.intermediariosAPI.listarIntermediarios(token);

      // 3. Verifica se o serviço retornou a estrutura de erro tratada no fetch
      if (data && data.error) {
        setError(data.message || "Erro ao buscar intermediários");

        // Salvaguarda de redireccionamento em caso de erro de autenticação
        if (data.status === 401 || data.status === 403) {
          navigate("/auth");
        }
        return;
      }

      console.log("Intermediários recebidos:", data);
      // Garante que o estado recebe um array válido
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
        <button
          onClick={fetchIntermediarios}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            background: "#2d4a6e",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a202c", margin: 0 }}>
          Intermediários
        </h1>
        <p style={{ color: "#718096", marginTop: 4 }}>
          {intermediarios.length} intermediário(s) disponível(is) para intermediação
        </p>
      </div>

      {/* Filtros */}
      <div style={{
        display: "flex",
        gap: 16,
        marginBottom: 24,
        flexWrap: "wrap",
        padding: "16px 20px",
        background: "#f7f8fa",
        borderRadius: 12,
        border: "1px solid #e2e8f0"
      }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", JSONBottom: 4 }}>
            Ordenar por
          </label>
          <select style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff" }}>
            <option>Melhor Avaliado</option>
            <option>Mais Vendas</option>
            <option>Mais Experiência</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>
            Localização
          </label>
          <select style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff" }}>
            <option>Todas</option>
            <option>Maputo</option>
            <option>Beira</option>
            <option>Nampula</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>
            Avaliação mínima
          </label>
          <select style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff" }}>
            <option>Qualquer</option>
            <option>4+ estrelas</option>
            <option>4.5+ estrelas</option>
          </select>
        </div>
      </div>

      {/* Lista de Intermediários */}
      {intermediarios.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#f7f8fa",
          borderRadius: 12,
          border: "1px solid #e2e8f0"
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#1a202c", marginTop: 16 }}>
            Nenhum intermediário encontrado
          </p>
          <p style={{ color: "#718096", fontSize: 14 }}>
            Não há intermediários cadastrados no momento.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {intermediarios.map((inter) => (
            <div
              key={inter.id}
              onClick={() => handleVerPerfil(inter.id)}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #e5eaf0",
                padding: "20px 24px",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(30,58,95,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {/* Avatar */}
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#1e3a5f",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: "bold",
                  flexShrink: 0
                }}>
                  {inter.nome?.charAt(0).toUpperCase() || "I"}
                </div>

                {/* Informações */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", margin: 0 }}>
                      {inter.nome}
                    </h2>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: "#eaf3de",
                      color: "#27500a"
                    }}>
                      {inter.avaliacao >= 4.8 ? "EXPERT" : "INTERMEDIÁRIO"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    {renderStars(inter.avaliacao || 4.5)}
                    <span style={{ fontSize: 13, color: "#64748b" }}>
                      ({inter.total_avaliacoes || 0} avaliações)
                    </span>
                    <span style={{ fontSize: 13, color: "#64748b" }}>
                      📍{inter.cidade || "Moçambique"}
                    </span>
                  </div>

                  <p style={{ fontSize: 14, color: "#4a5568", marginBottom: 16, lineHeight: 1.5 }}>
                    {inter.descricao || "Profissional dedicado a encontrar as melhores oportunidades de negócio para seus clientes."}
                  </p>

                  <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontSize: 11, color: "#718096", textTransform: "uppercase", fontWeight: 600 }}>
                        VENDAS
                      </span>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#1a202c", margin: 0 }}>
                        {inter.total_vendas || 0}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: "#718096", textTransform: "uppercase", fontWeight: 600 }}>
                        EXPERIÊNCIA
                      </span>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#1a202c", margin: 0 }}>
                        {inter.experiencia || "2 Anos"}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: "#718096", textTransform: "uppercase", fontWeight: 600 }}>
                        TICKET MÉDIO
                      </span>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#1a202c", margin: 0 }}>
                        MZN {inter.ticket_medio?.toLocaleString() || "5.000"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 160 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsApp(inter.telefone, inter.nome);
                    }}
                    style={{
                      padding: "10px 16px",
                      background: "#25D366",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    Negociar via WhatsApp
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerPerfil(inter.id);
                    }}
                    style={{
                      padding: "10px 16px",
                      background: "#1e3a5f",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    Ver Perfil Completo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}