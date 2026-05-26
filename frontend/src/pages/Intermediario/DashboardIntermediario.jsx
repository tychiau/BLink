// frontend/src/pages/Intermediario/DashboardIntermediario.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { intermediarioAPI, handleLogout } from "../../api";
import PerfilIntermediario from "./PerfilIntermediario";
import MeusProdutos from "./MeusProdutos";
import Vendas from "./Vendas";
import Ganhos from "./Ganhos";
import Chat from "./Chat";
import SolicitacoesIntermediario from "./SolicitacoesIntermediario";
import "./DashboardIntermediario.css";

// ============================================
// ÍCONES SVG PROFISSIONAIS
// ============================================

const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconMeusProdutos = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
    <line x1="16" y1="5" x2="8" y2="5" />
  </svg>
);

const IconGanhos = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconVendas = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconSair = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconNotificacao = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconPesquisa = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconRecarregar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
  </svg>
);

const IconLocalizacao = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconVendedor = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Ícones para estatísticas
const IconProdutosAtivos = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconVendasRealizadas = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconComissaoMes = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
  </svg>
);

const IconTaxaConversao = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
    <path d="M2 20L22 20" />
    <path d="M4 16L7 9" />
    <path d="M10 16L13 8" />
    <path d="M16 16L19 10" />
  </svg>
);

// ============================================
// CONFIGURAÇÕES
// ============================================

const menuItemsConfig = [
  { label: "Dashboard", icon: <IconDashboard />, page: "dashboard" },
  { label: "Meus Produtos", icon: <IconMeusProdutos />, page: "meus_produtos" },
  { label: "Vendas", icon: <IconVendas />, page: "vendas" },
  { label: "Ganhos", icon: <IconGanhos />, page: "ganhos" },
  { label: "Chat", icon: <IconChat />, page: "chat" },
];

const statsConfig = [
  { key: "produtosAtivos", icon: <IconProdutosAtivos />, label: "Produtos Ativos", highlight: false },
  { key: "vendasRealizadas", icon: <IconVendasRealizadas />, label: "Vendas Realizadas", highlight: false },
  { key: "comissaoMes", icon: <IconComissaoMes />, label: "Comissão do Mês", highlight: true },
  { key: "taxaConversao", icon: <IconTaxaConversao />, label: "Taxa de Conversão", highlight: false },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function DashboardIntermediario() {
  const navigate = useNavigate();
  
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [meusProdutos, setMeusProdutos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [solicitacoesCompraCount, setSolicitacoesCompraCount] = useState(0);
  const [stats, setStats] = useState({
    produtosAtivos: 0,
    vendasRealizadas: 0,
    comissaoMes: "0 MZN",
    taxaConversao: "0%",
  });
  const [solicitandoId, setSolicitandoId] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const loadingRef = useRef(false);

  // ============================================
  // FUNÇÕES AUXILIARES
  // ============================================

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const getToken = () => localStorage.getItem("accessToken");

  const getInicial = (nome) => (nome ? nome.charAt(0).toUpperCase() : "?");

  const getPapelUsuario = () => "Intermediário";

  const executarLogout = () => {
    handleLogout();
  };

  // ============================================
  // BUSCAR DADOS DA API
  // ============================================

  const fetchPerfil = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      
      const response = await intermediarioAPI.getPerfil(token);
      
      if (response && !response.error && response.data) {
        setPerfil({
          id: response.data.id,
          nome: response.data.nome,
          email: response.data.email,
          telefone: response.data.telefone,
          localizacao: response.data.localizacao,
          foto_perfil: response.data.foto_perfil,
          criado_em: response.data.data_criacao,
          status: response.data.status
        });
      } else {
        const usuarioData = localStorage.getItem("blink_user");
        if (usuarioData) {
          const usuario = JSON.parse(usuarioData);
          setPerfil({
            id: usuario.id,
            nome: usuario.nome || "Intermediário",
            email: usuario.email || "intermediario@blink.co.mz",
            telefone: usuario.telefone || "+258 84 000 0000",
            localizacao: usuario.localizacao || "Maputo, Moçambique",
            foto_perfil: null,
            criado_em: usuario.created_at || new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      const usuarioData = localStorage.getItem("blink_user");
      if (usuarioData) {
        const usuario = JSON.parse(usuarioData);
        setPerfil({
          id: usuario.id,
          nome: usuario.nome || "Intermediário",
          email: usuario.email || "intermediario@blink.co.mz",
          telefone: usuario.telefone || "+258 84 000 0000",
          localizacao: usuario.localizacao || "Maputo, Moçambique",
          foto_perfil: null,
          criado_em: usuario.created_at || new Date().toISOString(),
        });
      }
    }
  }, []);

  const fetchProdutos = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Token não encontrado");
        return;
      }

      const data = await intermediarioAPI.getOportunidades(token);
      
      if (data && !data.error) {
        if (Array.isArray(data)) {
          const produtosFormatados = data.map(produto => {
            const preco = Number(produto.preco_minimo) || 0;
            const comissaoPercentual = Number(produto.comissao_intermediario) || 5;
            const comissaoValor = (preco * comissaoPercentual) / 100;
            
            return {
              id: produto.id,
              nome: produto.nome,
              preco_minimo: preco,
              comissao_intermediario: comissaoPercentual,
              comissao_valor: comissaoValor,
              foto_url: produto.foto_url,
              categoria_nome: produto.categoria_nome,
              provincia: produto.provincia,
              vendedor_nome: produto.vendedor_nome,
              vendedor_id: produto.vendedor_id,
              status_solicitacao: produto.status_solicitacao
            };
          });
          
          const filtered = searchTerm 
            ? produtosFormatados.filter(p => 
                p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.vendedor_nome?.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : produtosFormatados;
          
          setProdutos(filtered);
          setErrorMessage(null);
        } else {
          setProdutos([]);
        }
      } else {
        console.error("Erro ao buscar oportunidades:", data?.message);
        setProdutos([]);
        if (data?.status === 403) {
          executarLogout();
        }
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setProdutos([]);
      setErrorMessage("Erro ao carregar produtos. Verifique sua conexão.");
    }
  }, [searchTerm]);

  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const data = await intermediarioAPI.getStats(token);
      
      if (data && !data.error) {
        setStats({
          produtosAtivos: data.produtos_ativos?.toString() || "0",
          vendasRealizadas: data.vendas_realizadas?.toString() || "0",
          comissaoMes: `${Number(data.comissao_mes || 0).toLocaleString()} MZN`,
          taxaConversao: `${data.taxa_conversao || 0}%`,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }, []);

  const fetchMeusProdutos = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const data = await intermediarioAPI.getMeusProdutosAtivos(token);
      
      if (data && !data.error) {
        if (Array.isArray(data)) {
          const produtosFormatados = data.map(produto => {
            const preco = Number(produto.preco_minimo) || 0;
            const comissaoPercentual = Number(produto.comissao_intermediario) || 5;
            const comissaoValor = (preco * comissaoPercentual) / 100;
            
            return {
              id: produto.id,
              nome: produto.nome,
              preco_minimo: preco,
              comissao_intermediario: comissaoPercentual,
              comissao_valor: comissaoValor,
              foto_url: produto.foto_url,
              vendedor_nome: produto.vendedor_nome,
              data_vinculo: produto.data_vinculo
            };
          });
          setMeusProdutos(produtosFormatados);
        } else {
          setMeusProdutos([]);
        }
      } else {
        setMeusProdutos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar meus produtos:", error);
      setMeusProdutos([]);
    }
  }, []);

  const fetchSolicitacoes = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const data = await intermediarioAPI.getAprovacoesPendentes(token);
      
      if (data && !data.error) {
        if (Array.isArray(data)) {
          const solicitacoesFormatadas = data.map(item => ({
            id: item.id,
            produto_id: item.produto_id,
            produto_nome: item.produto_nome,
            vendedor_nome: item.vendedor_nome,
            foto_url: item.foto_url,
            data_solicitacao: item.data_solicitacao || new Date().toISOString(),
            status: item.status || "pendente"
          }));
          setSolicitacoes(solicitacoesFormatadas);
        } else {
          setSolicitacoes([]);
        }
      } else {
        setSolicitacoes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      setSolicitacoes([]);
    }
  }, []);

  // Buscar contagem de solicitações de compra para o badge
  const fetchSolicitacoesCompraCount = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      
      const response = await fetch('https://blink-oz62.onrender.com/api/intermediario/solicitacoes-compra', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (!data.error && Array.isArray(data)) {
        setSolicitacoesCompraCount(data.length);
      }
    } catch (error) {
      console.error("Erro ao buscar contagem de solicitações:", error);
    }
  }, []);

  // ============================================
  // AÇÕES
  // ============================================

  const handleSolicitarIntermediacao = async (produtoId) => {
    setSolicitandoId(produtoId);
    try {
      const token = getToken();
      if (!token) {
        showNotification("Token não encontrado. Faça login novamente.", "error");
        executarLogout();
        return;
      }

      const result = await intermediarioAPI.solicitarIntermediacao(token, produtoId);

      if (!result?.error) {
        showNotification("Solicitação enviada com sucesso!", "success");
        await loadAllData();
      } else {
        showNotification(result?.message || "Erro ao solicitar", "error");
      }
    } catch (error) {
      console.error("Erro ao solicitar:", error);
      showNotification("Erro ao conectar ao servidor", "error");
    } finally {
      setSolicitandoId(null);
    }
  };

  const handleCancelarSolicitacao = async (solicitacaoId) => {
    setCancelandoId(solicitacaoId);
    try {
      const token = getToken();
      if (!token) {
        showNotification("Token não encontrado", "error");
        return;
      }

      const result = await intermediarioAPI.cancelarSolicitacao(token, solicitacaoId);

      if (!result?.error) {
        showNotification("Solicitação cancelada com sucesso!", "success");
        await loadAllData();
      } else {
        showNotification(result?.message || "Erro ao cancelar solicitação", "error");
      }
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      showNotification("Erro ao conectar ao servidor", "error");
    } finally {
      setCancelandoId(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData(true);
    setRefreshing(false);
    showNotification("Dados atualizados com sucesso!", "success");
  };

  const loadAllData = async (force = false) => {
    if (loadingRef.current && !force) return;
    loadingRef.current = true;
    setLoading(true);
    setErrorMessage(null);
    
    await Promise.all([
      fetchProdutos(),
      fetchStats(),
      fetchMeusProdutos(),
      fetchSolicitacoes(),
      fetchSolicitacoesCompraCount()
    ]);
    
    setLoading(false);
    loadingRef.current = false;
  };

  const handlePerfilAtualizado = (dadosAtualizados) => {
    setPerfil(prev => ({ ...prev, ...dadosAtualizados }));
    
    const usuarioData = localStorage.getItem("blink_user");
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      usuario.nome = dadosAtualizados.nome;
      usuario.telefone = dadosAtualizados.telefone;
      usuario.localizacao = dadosAtualizados.localizacao;
      localStorage.setItem("blink_user", JSON.stringify(usuario));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    fetchPerfil();
    loadAllData();
  }, [fetchPerfil]);

  useEffect(() => {
    fetchProdutos();
  }, [searchTerm]);

  // ============================================
  // RENDER
  // ============================================

  if (loading && produtos.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="di-root">
      {/* TOAST NOTIFICATION */}
      {notification.show && (
        <div className={`di-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* MODAL DE PERFIL */}
      {showPerfilModal && perfil && (
        <div className="di-modal-fullscreen-overlay">
          <div className="di-modal-fullscreen">
            <PerfilIntermediario 
              perfilData={perfil}
              onClose={() => setShowPerfilModal(false)}
              onLogout={executarLogout}
              onPerfilAtualizado={handlePerfilAtualizado}
            />
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="di-navbar">
        <span className="di-logo">BLINK</span>
        <div className="di-search-wrapper">
          <span className="di-search-icon"><IconPesquisa /></span>
          <input
            className="di-search"
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="di-nav-icons">
          <button 
            className="di-icon-btn" 
            onClick={() => setActivePage("solicitacoes")}
            style={{ position: "relative" }}
          >
            <IconNotificacao />
            {solicitacoesCompraCount > 0 && (
              <span className="di-solicitacoes-badge">{solicitacoesCompraCount}</span>
            )}
          </button>
          <button className="di-icon-btn" onClick={() => setActivePage("chat")}>
            <IconChat />
          </button>
          <div className="di-avatar" onClick={() => setShowPerfilModal(true)}>
            {perfil ? getInicial(perfil.nome) : "I"}
          </div>
        </div>
      </nav>

      {/* BODY */}
      <div className="di-body">
        {/* SIDEBAR */}
        <aside className="di-sidebar">
          <nav className="di-menu">
            {menuItemsConfig.map((item) => (
              <button
                key={item.label}
                className={`di-menu-item ${activePage === item.page ? "di-menu-item--active" : ""}`}
                onClick={() => setActivePage(item.page)}
              >
                <span className="di-menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* PERFIL DO USUÁRIO */}
          <div className="di-sidebar-profile">
            <div className="di-profile-avatar" onClick={() => setShowPerfilModal(true)}>
              {perfil ? getInicial(perfil.nome) : "I"}
            </div>
            <div className="di-profile-info" onClick={() => setShowPerfilModal(true)}>
              <p className="di-profile-name">{perfil?.nome || "Intermediário"}</p>
              <p className="di-profile-role">{getPapelUsuario()}</p>
            </div>
          </div>
          
          {/* BOTÃO SAIR */}
          <button onClick={executarLogout} className="di-btn-sair">
            <IconSair />
            <span>Sair</span>
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="di-main">
          {/* DASHBOARD PAGE */}
          {activePage === "dashboard" && (
            <>
              <div className="di-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h1 className="di-welcome">
                      Bem-vindo, {perfil?.nome?.split(" ")[0] || "Intermediário"}
                    </h1>
                    <p className="di-welcome-sub">
                      Gerencie suas intermediações e acompanhe seus ganhos.
                    </p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="di-refresh-btn"
                  >
                    <IconRecarregar />
                    {refreshing ? "A recarregar..." : "Recarregar"}
                  </button>
                </div>
              </div>

              {/* MENSAGEM DE ERRO */}
              {errorMessage && (
                <div className="di-error-message">
                  {errorMessage}
                  <button onClick={handleRefresh}>Tentar novamente</button>
                </div>
              )}

              {/* STATS CARDS */}
              <div className="di-stats-grid">
                {statsConfig.map((stat) => (
                  <div key={stat.key} className="di-stat-card">
                    <div className="di-stat-top">
                      <div className="di-stat-icon-box">{stat.icon}</div>
                    </div>
                    <p className="di-stat-label">{stat.label}</p>
                    <p className={`di-stat-value ${stat.highlight ? "highlight" : ""}`}>
                      {stats[stat.key]}
                    </p>
                  </div>
                ))}
              </div>

              {/* PRODUTOS DISPONÍVEIS */}
              <div className="di-section-header">
                <h2 className="di-section-title">Produtos Disponíveis</h2>
                <button className="di-ver-todos" onClick={() => setActivePage("meus_produtos")}>
                  Ver todos ({produtos.length})
                </button>
              </div>

              <div className="di-produtos-grid">
                {produtos.slice(0, 4).map((produto) => (
                  <div key={produto.id} className="di-produto-card">
                    <img
                      src={produto.foto_url || "https://placehold.co/300x150/1e3a5f/ffffff?text=Produto"}
                      alt={produto.nome}
                      className="di-produto-imagem"
                    />
                    <div className="di-produto-info">
                      <div className="di-produto-header">
                        <h3 className="di-produto-nome">{produto.nome}</h3>
                        <span className="di-produto-badge di-badge-disponivel">Disponível</span>
                      </div>
                      <div className="di-produto-categoria">
                        {produto.categoria_nome?.toUpperCase() || "PRODUTO"}
                      </div>
                      <div className="di-produto-preco">
                        MZN {produto.preco_minimo.toLocaleString()}
                      </div>
                      <div className="di-produto-comissao">
                        Sua comissão ({produto.comissao_intermediario}%): MZN {produto.comissao_valor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="di-produto-localizacao">
                        <IconLocalizacao /> {produto.provincia || "Localização não definida"}
                      </div>
                      <div className="di-produto-vendedor">
                        <IconVendedor /> {produto.vendedor_nome || "Vendedor"}
                      </div>
                      <button
                        className="di-btn-solicitar"
                        onClick={() => handleSolicitarIntermediacao(produto.id)}
                        disabled={solicitandoId === produto.id}
                      >
                        {solicitandoId === produto.id ? "Enviando..." : "Solicitar Intermediação"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {produtos.length === 0 && !loading && (
                <div className="di-empty-state">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
                    <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                  </svg>
                  <p>Nenhum produto disponível no momento</p>
                  <small>Você já solicitou todos os produtos disponíveis ou não há produtos publicados.</small>
                </div>
              )}

              {/* BOTTOM GRID - Solicitações e Meus Produtos */}
              <div className="di-bottom-grid">
                {/* Solicitações Pendentes */}
                <div className="di-card">
                  <div className="di-card-header">
                    <span className="di-card-title">Solicitações Pendentes</span>
                    {solicitacoes.length > 0 && (
                      <button className="di-ver-todos" onClick={() => setActivePage("meus_produtos")}>
                        Ver todos
                      </button>
                    )}
                  </div>
                  {solicitacoes.length === 0 ? (
                    <div className="di-empty-state-small">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <p>Sem solicitações pendentes</p>
                    </div>
                  ) : (
                    solicitacoes.map((solic) => (
                      <div key={solic.id} className="di-solicitacao-item">
                        <img
                          src={solic.foto_url || "https://placehold.co/44x44/1e3a5f/ffffff?text=P"}
                          alt={solic.produto_nome}
                          className="di-solicitacao-imagem"
                        />
                        <div className="di-solicitacao-info">
                          <div className="di-solicitacao-nome">{solic.produto_nome}</div>
                          <div className="di-solicitacao-vendedor">{solic.vendedor_nome}</div>
                          <span className="di-solicitacao-status di-status-pendente">Pendente</span>
                          <div className="di-solicitacao-data">
                            {new Date(solic.data_solicitacao).toLocaleDateString('pt-MZ')}
                          </div>
                        </div>
                        <button
                          className="di-btn-cancelar"
                          onClick={() => handleCancelarSolicitacao(solic.id)}
                          disabled={cancelandoId === solic.id}
                        >
                          {cancelandoId === solic.id ? "Cancelando..." : "Cancelar"}
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Meus Produtos Ativos */}
                <div className="di-card">
                  <div className="di-card-header">
                    <span className="di-card-title">Meus Produtos Ativos</span>
                    {meusProdutos.length > 0 && (
                      <button className="di-ver-todos" onClick={() => setActivePage("meus_produtos")}>
                        Ver todos
                      </button>
                    )}
                  </div>
                  {meusProdutos.length === 0 ? (
                    <div className="di-empty-state-small">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
                        <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                      <p>Nenhum produto ativo</p>
                    </div>
                  ) : (
                    meusProdutos.slice(0, 3).map((produto, index) => (
                      <div key={index} className="di-produto-ativo">
                        <img
                          src={produto.foto_url || "https://placehold.co/52x52/1e3a5f/ffffff?text=P"}
                          alt={produto.nome}
                          className="di-produto-ativo-imagem"
                        />
                        <div className="di-produto-ativo-info">
                          <div className="di-produto-ativo-nome">{produto.nome}</div>
                          <div className="di-produto-ativo-meta">
                            Preço: MZN {produto.preco_minimo.toLocaleString()} • Comissão: {produto.comissao_intermediario}%
                          </div>
                          <div className="di-produto-ativo-ganho">
                            Seu ganho: MZN {produto.comissao_valor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* MEUS PRODUTOS PAGE */}
          {activePage === "meus_produtos" && (
            <MeusProdutos 
              token={getToken()} 
              onShowNotification={showNotification}
            />
          )}

          {/* VENDAS PAGE */}
          {activePage === "vendas" && (
            <Vendas 
              token={getToken()} 
              onShowNotification={showNotification}
            />
          )}

          {/* GANHOS PAGE */}
          {activePage === "ganhos" && (
            <Ganhos 
              token={getToken()} 
              onShowNotification={showNotification}
            />
          )}

          {/* SOLICITAÇÕES PAGE */}
          {activePage === "solicitacoes" && (
            <SolicitacoesIntermediario />
          )}

          {/* CHAT PAGE */}
          {activePage === "chat" && (
            <Chat 
              token={getToken()} 
              perfil={perfil}
              onShowNotification={showNotification}
            />
          )}
        </main>
      </div>

      <style>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #1e3a5f;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .di-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease;
        }
        .di-toast.success { background: #10b981; color: white; }
        .di-toast.error { background: #ef4444; color: white; }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .di-modal-fullscreen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.9);
          z-index: 20000;
          overflow-y: auto;
        }
        
        .di-modal-fullscreen {
          min-height: 100vh;
          background: #f7f8fa;
        }
        
        .di-refresh-btn {
          padding: 6px 14px;
          background: #1e3a5f;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .di-refresh-btn:hover:not(:disabled) {
          background: #2d4a6e;
        }
        
        .di-error-message {
          background: #fcebeb;
          color: #791f1f;
          padding: 10px 14px;
          margin-bottom: 20px;
          border-radius: 8px;
          border: 0.5px solid #f7c1c1;
        }
        
        .di-error-message button {
          margin-left: 10px;
          padding: 4px 8px;
          cursor: pointer;
        }
        
        .di-empty-state-small {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          color: #94a3b8;
          text-align: center;
        }
        
        .di-empty-state-small p {
          margin-top: 8px;
          font-size: 13px;
        }
        
        .di-produto-ativo-ganho {
          font-size: 12px;
          color: #10b981;
          font-weight: 600;
          margin-top: 6px;
        }
        
        .di-btn-sair {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: calc(100% - 20px);  
          margin: 12px 10px;         
          padding: 8px 12px;          
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
                  
        .di-btn-sair:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }
        
        .di-sidebar {
          width: 280px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
        }
        
        .di-sidebar-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          margin-top: auto;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .di-sidebar-profile:hover {
          background: #f1f5f9;
        }
        
        .di-profile-avatar {
          width: 40px;
          height: 40px;
          background: #1e3a5f;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }
        
        .di-profile-info {
          flex: 1;
        }
        
        .di-profile-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }
        
        .di-profile-role {
          font-size: 12px;
          color: #64748b;
        }
        
        .di-solicitacoes-badge {
          position: absolute;
          top: -5px;
          right: -8px;
          background-color: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: bold;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #fff;
        }
        
        .di-root {
          overflow-x: hidden;
        }
        
        .di-body {
          overflow-x: hidden;
        }
        
        .di-main {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}