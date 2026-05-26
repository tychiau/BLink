// frontend/src/pages/Intermediario/SolicitacoesIntermediario.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SolicitacoesIntermediario.css";

const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const IconVoltar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
  </svg>
);

export default function SolicitacoesIntermediario() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aprovandoId, setAprovandoId] = useState(null);
  const [rejeitandoId, setRejeitandoId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const getToken = () => localStorage.getItem("accessToken");
  const API_BASE_URL = 'https://blink-oz62.onrender.com';

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const fetchSolicitacoes = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/intermediario/solicitacoes-compra`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!data.error && Array.isArray(data)) {
        setSolicitacoes(data);
      } else {
        setSolicitacoes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      setSolicitacoes([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSolicitacoes();
    showNotification("Solicitações atualizadas!", "success");
  };

  const handleAprovar = async (solicitacaoId) => {
    setAprovandoId(solicitacaoId);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/intermediario/solicitacoes-compra/${solicitacaoId}/aprovar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        showNotification("Compra aprovada com sucesso!", "success");
        await fetchSolicitacoes();
      } else {
        showNotification(data.message || "Erro ao aprovar", "error");
      }
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      showNotification("Erro ao conectar ao servidor", "error");
    } finally {
      setAprovandoId(null);
    }
  };

  const handleRejeitar = async (solicitacaoId) => {
    setRejeitandoId(solicitacaoId);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/intermediario/solicitacoes-compra/${solicitacaoId}/rejeitar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        showNotification("Compra rejeitada", "success");
        await fetchSolicitacoes();
      } else {
        showNotification(data.message || "Erro ao rejeitar", "error");
      }
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      showNotification("Erro ao conectar ao servidor", "error");
    } finally {
      setRejeitandoId(null);
    }
  };

  const abrirWhatsApp = (telefone, nome) => {
    const numero = telefone?.replace(/[^0-9]/g, '') || "";
    const mensagem = `Olá ${nome}! Sou intermediário no BLINK. Recebi sua solicitação de compra. Vamos conversar?`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const handleVoltar = () => {
    navigate("/intermediario/dashboard");
  };

  useEffect(() => {
    fetchSolicitacoes();
    
    // Intervalo para buscar novas solicitações a cada 30 segundos
    const interval = setInterval(fetchSolicitacoes, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="si-loading">
        <div className="spinner"></div>
        <p>Carregando solicitações...</p>
      </div>
    );
  }

  return (
    <div className="si-container">
      {notification.show && (
        <div className={`si-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="si-header">
        <div className="si-header-left">
          <button className="si-btn-voltar" onClick={handleVoltar}>
            <IconVoltar />
            Voltar ao Dashboard
          </button>
          <h1 className="si-title">Solicitações de Compra</h1>
          <p className="si-subtitle">Clientes interessados nos seus produtos</p>
        </div>
        <div className="si-header-right">
          <button className="si-btn-refresh" onClick={handleRefresh} disabled={refreshing}>
            <IconRefresh />
            {refreshing ? "Atualizando..." : "Atualizar"}
          </button>
          <span className="si-badge">{solicitacoes.length} pendente{solicitacoes.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {solicitacoes.length === 0 ? (
        <div className="si-empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p>Nenhuma solicitação de compra pendente</p>
          <small>Quando clientes solicitarem compras, aparecerão aqui.</small>
          <button className="si-btn-voltar-dashboard" onClick={handleVoltar}>
            Voltar para Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="si-solicitacoes-list">
            {solicitacoes.map((solic) => (
              <div key={solic.id} className="si-solicitacao-card">
                <div className="si-solicitacao-header">
                  <div className="si-cliente-info">
                    <div className="si-cliente-avatar">
                      {solic.cliente_nome?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <h3 className="si-cliente-nome">{solic.cliente_nome}</h3>
                      <div className="si-cliente-contato">
                        {solic.cliente_email && <span>📧 {solic.cliente_email}</span>}
                        {solic.cliente_telefone && <span>📞 {solic.cliente_telefone}</span>}
                      </div>
                    </div>
                  </div>
                  <span className="si-status-pendente">⏳ Pendente</span>
                </div>

                <div className="si-produto-info">
                  <img
                    src={solic.foto_produto}
                    alt={solic.produto_nome}
                    className="si-produto-imagem"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/80x80/1e3a5f/ffffff?text=P";
                    }}
                  />
                  <div className="si-produto-detalhes">
                    <h4 className="si-produto-nome">{solic.produto_nome}</h4>
                    <div className="si-produto-valor">
                      💰 Valor: <strong>MZN {solic.valor.toLocaleString()}</strong>
                    </div>
                    <div className="si-produto-comissao">
                      🎯 Sua comissão: <strong>MZN {solic.comissao.toLocaleString()}</strong> ({solic.comissao_percentual}%)
                    </div>
                    <div className="si-produto-data">
                      📅 Solicitado em: {new Date(solic.data_solicitacao).toLocaleDateString('pt-MZ')}
                    </div>
                  </div>
                </div>

                <div className="si-solicitacao-actions">
                  <button
                    className="si-btn-whatsapp"
                    onClick={() => abrirWhatsApp(solic.cliente_telefone, solic.cliente_nome)}
                  >
                    <IconWhatsApp />
                    WhatsApp
                  </button>
                  <button
                    className="si-btn-aprovar"
                    onClick={() => handleAprovar(solic.id)}
                    disabled={aprovandoId === solic.id}
                  >
                    {aprovandoId === solic.id ? "✓ Aprovando..." : "✓ Aprovar"}
                  </button>
                  <button
                    className="si-btn-rejeitar"
                    onClick={() => handleRejeitar(solic.id)}
                    disabled={rejeitandoId === solic.id}
                  >
                    {rejeitandoId === solic.id ? "✗ Rejeitando..." : "✗ Rejeitar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="si-footer-actions">
            <button className="si-btn-voltar-footer" onClick={handleVoltar}>
              <IconVoltar />
              Voltar ao Dashboard
            </button>
          </div>
        </>
      )}

      <style>{`
        .si-footer-actions {
          display: flex;
          justify-content: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }
        
        .si-btn-voltar-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 24px;
          background: #1e3a5f;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .si-btn-voltar-footer:hover {
          background: #2d4a6e;
          transform: translateY(-1px);
        }
        
        .si-btn-voltar {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f1f5f9;
          color: #1e3a5f;
          border: none;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        
        .si-btn-voltar:hover {
          background: #e2e8f0;
        }
        
        .si-btn-refresh {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f1f5f9;
          color: #1e3a5f;
          border: none;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          margin-right: 12px;
          transition: all 0.2s;
        }
        
        .si-btn-refresh:hover:not(:disabled) {
          background: #e2e8f0;
        }
        
        .si-btn-refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .si-header-left {
          flex: 1;
        }
        
        .si-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .si-voltar-dashboard {
          margin-top: 16px;
        }
        
        .si-btn-voltar-dashboard {
          margin-top: 16px;
          padding: 8px 20px;
          background: #1e3a5f;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .si-btn-voltar-dashboard:hover {
          background: #2d4a6e;
        }
      `}</style>
    </div>
  );
}