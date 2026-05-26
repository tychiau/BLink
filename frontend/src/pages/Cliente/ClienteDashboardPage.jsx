// frontend/src/pages/Cliente/ClienteDashboardPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout, clienteAPI } from "../../api";
import "./ClienteDashboard.css";

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

const IconPedidos = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
    <line x1="16" y1="5" x2="8" y2="5" />
  </svg>
);

const IconFavoritos = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconNegociacoes = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconMensagens = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const IconConfiguracoes = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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

const IconCarrinhoCompras = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

// ============================================
// CATEGORIAS (mesmo mapeamento do CadastroProduto)
// ============================================

const CATEGORIAS = [
  { id: 1, nome: "Eletrônicos" },
  { id: 2, nome: "Moda" },
  { id: 3, nome: "Casa & Decoração" },
  { id: 4, nome: "Esportes" },
  { id: 5, nome: "Livros" },
  { id: 6, nome: "Automotivo" },
  { id: 7, nome: "Outros" },
];

const getCategoriaNome = (categoriaId) => {
  const categoria = CATEGORIAS.find(c => c.id === Number(categoriaId));
  return categoria ? categoria.nome : "Outros";
};

// ============================================
// CONFIGURAÇÕES DO MENU
// ============================================

const menuItemsConfig = [
  { label: "Dashboard", icon: <IconDashboard />, page: "dashboard" },
  { label: "Meus Pedidos", icon: <IconPedidos />, page: "pedidos" },
  { label: "Favoritos", icon: <IconFavoritos />, page: "favoritos" },
  { label: "Negociações", icon: <IconNegociacoes />, page: "negociacoes" },
  { label: "Mensagens", icon: <IconMensagens />, page: "mensagens" },
  { label: "Configurações", icon: <IconConfiguracoes />, page: "configuracoes" },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ClienteDashboardPage() {
  const navigate = useNavigate();
  
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [produtosOriginais, setProdutosOriginais] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [showCarrinho, setShowCarrinho] = useState(false);
  const [negociacoes, setNegociacoes] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
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

  const getInicial = (nome) => (nome ? nome.charAt(0).toUpperCase() : "C");

  const executarLogout = () => {
    handleLogout();
  };

  // ============================================
  // BUSCAR DADOS DA API
  // ============================================

  const fetchPerfil = useCallback(async () => {
    try {
      const usuarioData = localStorage.getItem("blink_user");
      if (usuarioData) {
        const usuario = JSON.parse(usuarioData);
        setPerfil({
          id: usuario.id,
          nome: usuario.nome || "Cliente",
          email: usuario.email || "cliente@blink.co.mz",
          telefone: usuario.telefone || "",
          localizacao: usuario.localizacao || "Maputo, Moçambique",
          foto_perfil: null,
          criado_em: usuario.created_at || new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    }
  }, []);

  const fetchProdutos = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const data = await clienteAPI.getProdutosIntermediados(token);
      
      if (data && !data.error && Array.isArray(data)) {
        const produtosMap = new Map();
        
        data.forEach(p => {
          const produtoId = p.produto_id;
          if (!produtosMap.has(produtoId)) {
            const categoriaId = Number(p.categoria_id);
            produtosMap.set(produtoId, {
              id: produtoId,
              nome: p.produto_nome,
              preco: p.preco_minimo,
              preco_formatado: `${Number(p.preco_minimo).toLocaleString()} MZN`,
              categoria_id: categoriaId,
              categoria_nome: getCategoriaNome(categoriaId),
              imagem: p.produto_foto || "https://placehold.co/300x200/1e3a5f/ffffff?text=Produto",
              descricao: p.produto_descricao,
              provincia: p.provincia,
              intermediario_nome: p.intermediario_nome,
              intermediario_id: p.intermediario_id,
              comissao_intermediario: p.comissao_intermediario || 5
            });
          }
        });
        
        const produtosFormatados = Array.from(produtosMap.values());
        setProdutos(produtosFormatados);
        setProdutosOriginais(produtosFormatados);
      } else {
        setProdutos([]);
        setProdutosOriginais([]);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProdutos([]);
      setProdutosOriginais([]);
    }
  }, []);

  const fetchMinhasSolicitacoes = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      
      const data = await clienteAPI.minhasSolicitacoes(token);
      
      if (data && !data.error && Array.isArray(data)) {
        const solicitacoesFormatadas = data.map(s => ({
          id: s.id,
          produto_id: s.produto_id,
          nome: s.produto_nome,
          preco: s.valor,
          preco_formatado: s.valor_formatado,
          imagem: s.foto_produto,
          intermediario_nome: s.intermediario_nome,
          status: s.status,
          dataCompra: s.data_solicitacao
        }));
        setCarrinho(solicitacoesFormatadas);
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
    }
  }, []);

  const fetchNegociacoes = useCallback(async () => {
    setNegociacoes([]);
  }, []);

  // ============================================
  // FUNÇÃO DE FILTRAGEM
  // ============================================
  
  const aplicarFiltros = useCallback(() => {
    if (produtosOriginais.length === 0) return;
    
    let filtrados = [...produtosOriginais];
    
    if (categoriaSelecionada !== null && categoriaSelecionada !== undefined) {
      filtrados = filtrados.filter(produto => produto.categoria_id === categoriaSelecionada);
    }
    
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      filtrados = filtrados.filter(produto => 
        produto.nome.toLowerCase().includes(term) ||
        (produto.intermediario_nome && produto.intermediario_nome.toLowerCase().includes(term))
      );
    }
    
    setProdutos(filtrados);
  }, [categoriaSelecionada, searchTerm, produtosOriginais]);

  useEffect(() => {
    if (produtosOriginais.length > 0) {
      aplicarFiltros();
    }
  }, [categoriaSelecionada, searchTerm, produtosOriginais, aplicarFiltros]);

  // ============================================
  // FUNÇÕES DO CARRINHO (COM API)
  // ============================================

  const handleComprar = async (produto) => {
    const existeNoCarrinho = carrinho.some(item => item.produto_id === produto.id);
    
    if (existeNoCarrinho) {
      showNotification(`"${produto.nome}" já está no seu carrinho!`, "error");
      return;
    }
    
    try {
      const token = getToken();
      const response = await clienteAPI.solicitarCompra(token, {
        produto_id: produto.id,
        intermediario_id: produto.intermediario_id,
        valor: produto.preco,
        produto_nome: produto.nome,
        comissao_percentual: produto.comissao_intermediario || 5
      });
      
      if (response && !response.error && response.success) {
        showNotification(`Solicitação de compra de "${produto.nome}" enviada ao intermediário!`, "success");
        await fetchMinhasSolicitacoes();
      } else {
        showNotification(response?.message || "Erro ao solicitar compra", "error");
      }
    } catch (error) {
      console.error("Erro ao solicitar compra:", error);
      showNotification("Erro ao conectar ao servidor", "error");
    }
  };

  const handleCancelarCompra = async (solicitacaoId, produtoNome) => {
    try {
      const token = getToken();
      const response = await clienteAPI.cancelarSolicitacao(token, solicitacaoId);
      
      if (response && !response.error && response.success) {
        setCarrinho(prev => prev.filter(item => item.id !== solicitacaoId));
        showNotification(`Solicitação de compra de "${produtoNome}" cancelada!`, "success");
      } else {
        showNotification(response?.message || "Erro ao cancelar", "error");
      }
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      showNotification("Erro ao conectar ao servidor", "error");
    }
  };

  const handleFinalizarCompra = () => {
    if (carrinho.length === 0) {
      showNotification("Seu carrinho está vazio!", "error");
      return;
    }
    
    showNotification(`Solicitações de compra enviadas! Aguardando aprovação dos intermediários.`, "success");
  };

  const calcularTotalCarrinho = () => {
    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    return `${total.toLocaleString()} MZN`;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProdutos(), fetchMinhasSolicitacoes()]);
    setCategoriaSelecionada(null);
    setSearchTerm("");
    setRefreshing(false);
    showNotification("Dados atualizados com sucesso!", "success");
  };

  const loadAllData = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    
    await Promise.all([
      fetchProdutos(),
      fetchMinhasSolicitacoes(),
      fetchNegociacoes()
    ]);
    
    setLoading(false);
    loadingRef.current = false;
  };

  useEffect(() => {
    fetchPerfil();
    loadAllData();
  }, [fetchPerfil]);

  if (loading && produtos.length === 0) {
    return (
      <div className="cd-loading-container">
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="cd-root">
      {notification.show && (
        <div className={`cd-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* MODAL DO CARRINHO */}
      {showCarrinho && (
        <div className="cd-modal-carrinho-overlay" onClick={() => setShowCarrinho(false)}>
          <div className="cd-modal-carrinho" onClick={(e) => e.stopPropagation()}>
            <div className="cd-modal-carrinho-header">
              <h3>Meu Carrinho</h3>
              <button className="cd-modal-carrinho-close" onClick={() => setShowCarrinho(false)}>
                ✕
              </button>
            </div>
            <div className="cd-modal-carrinho-body">
              {carrinho.length === 0 ? (
                <div className="cd-carrinho-vazio">
                  <IconCarrinhoCompras />
                  <p>Seu carrinho está vazio</p>
                  <small>Adicione produtos clicando em "Comprar"</small>
                </div>
              ) : (
                <>
                  <div className="cd-modal-carrinho-lista">
                    {carrinho.map((item) => (
                      <div key={item.id} className="cd-modal-carrinho-item">
                        <img
                          src={item.imagem}
                          alt={item.nome}
                          className="cd-modal-carrinho-imagem"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/60x60/1e3a5f/ffffff?text=P";
                          }}
                        />
                        <div className="cd-modal-carrinho-info">
                          <div className="cd-modal-carrinho-nome">{item.nome}</div>
                          <div className="cd-modal-carrinho-preco">{item.preco_formatado}</div>
                          {item.status === 'aprovada' && (
                            <div className="cd-carrinho-status-aprovado">✓ Aprovado</div>
                          )}
                          {item.status === 'pendente' && (
                            <div className="cd-carrinho-status-pendente">⏳ Aguardando aprovação</div>
                          )}
                        </div>
                        {item.status === 'pendente' && (
                          <button 
                            className="cd-modal-carrinho-remover"
                            onClick={() => handleCancelarCompra(item.id, item.nome)}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="cd-modal-carrinho-total">
                    <span>Total:</span>
                    <strong>{calcularTotalCarrinho()}</strong>
                  </div>
                  <button 
                    className="cd-modal-carrinho-finalizar"
                    onClick={handleFinalizarCompra}
                  >
                    Finalizar Compras
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="cd-navbar">
        <span className="cd-logo">BLINK</span>
        <div className="cd-search-wrapper">
          <span className="cd-search-icon"><IconPesquisa /></span>
          <input
            className="cd-search"
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="cd-nav-icons">
          <button className="cd-icon-btn">
            <IconNotificacao />
          </button>
          <button 
            className="cd-icon-btn cd-carrinho-btn"
            onClick={() => setShowCarrinho(true)}
            style={{ position: "relative" }}
          >
            <IconCarrinhoCompras />
            {carrinho.length > 0 && (
              <span className="cd-carrinho-badge">{carrinho.length}</span>
            )}
          </button>
          <div className="cd-avatar">
            {perfil ? getInicial(perfil.nome) : "C"}
          </div>
        </div>
      </nav>

      {/* BODY */}
      <div className="cd-body">
        {/* SIDEBAR */}
        <aside className="cd-sidebar">
          <nav className="cd-menu">
            {menuItemsConfig.map((item) => (
              <button
                key={item.label}
                className={`cd-menu-item ${activePage === item.page ? "cd-menu-item--active" : ""}`}
                onClick={() => setActivePage(item.page)}
              >
                <span className="cd-menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="cd-sidebar-profile">
            <div className="cd-profile-avatar">
              {perfil ? getInicial(perfil.nome) : "C"}
            </div>
            <div className="cd-profile-info">
              <p className="cd-profile-name">{perfil?.nome || "Cliente"}</p>
              <p className="cd-profile-role">Cliente</p>
            </div>
          </div>
          
          <button onClick={executarLogout} className="cd-btn-sair">
            <IconSair />
            <span>Sair</span>
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="cd-main">
          {/* DASHBOARD PAGE */}
          {activePage === "dashboard" && (
            <>
              <div className="cd-header">
                <div className="cd-header-content">
                  <div className="cd-header-left">
                    <h1 className="cd-welcome">
                      Bem-vindo, {perfil?.nome?.split(" ")[0] || "Cliente"}!
                    </h1>
                    <p className="cd-welcome-sub">
                      Explore produtos disponíveis e acompanhe suas negociações.
                    </p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="cd-refresh-btn"
                  >
                    <IconRecarregar />
                    {refreshing ? "A recarregar..." : "Recarregar"}
                  </button>
                </div>
              </div>

              <div className="cd-filtro-container">
                <div className="cd-filtro-header">
                  <span className="cd-filtro-label">Filtrar por categoria:</span>
                </div>
                <div className="cd-categorias-wrapper">
                  <button
                    onClick={() => setCategoriaSelecionada(null)}
                    className={`cd-categoria-btn ${categoriaSelecionada === null ? "active" : ""}`}
                  >
                    Todos
                  </button>
                  {CATEGORIAS.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoriaSelecionada(cat.id)}
                      className={`cd-categoria-btn ${categoriaSelecionada === cat.id ? "active" : ""}`}
                    >
                      {cat.nome}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cd-section-header">
                <h2 className="cd-section-title">Produtos Disponíveis</h2>
                <span className="cd-produtos-count">{produtos.length} produtos</span>
              </div>

              <div className="cd-produtos-grid">
                {produtos.length === 0 ? (
                  <div className="cd-empty-state">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
                      <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                    <p>Nenhum produto disponível</p>
                    <small>Novos produtos aparecerão aqui quando disponíveis.</small>
                  </div>
                ) : (
                  produtos.map((produto) => (
                    <div key={produto.id} className="cd-produto-card">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="cd-produto-imagem"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/300x200/1e3a5f/ffffff?text=Produto";
                        }}
                      />
                      <div className="cd-produto-info">
                        <div className="cd-produto-header">
                          <h3 className="cd-produto-nome">{produto.nome}</h3>
                          <span className="cd-produto-badge cd-badge-disponivel">Disponível</span>
                        </div>
                        <div className="cd-produto-categoria">
                          {produto.categoria_nome}
                        </div>
                        <div className="cd-produto-preco">
                          {produto.preco_formatado}
                        </div>
                        <div className="cd-produto-localizacao">
                          <IconLocalizacao /> {produto.provincia || "Localização não definida"}
                        </div>
                        {produto.intermediario_nome && (
                          <div className="cd-produto-intermediario">
                            <span>Intermediário: {produto.intermediario_nome}</span>
                          </div>
                        )}
                        <button 
                          className="cd-btn-comprar"
                          onClick={() => handleComprar(produto)}
                        >
                          <IconCarrinhoCompras />
                          Comprar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="cd-section-header">
                <h2 className="cd-section-title">Negociações Ativas</h2>
              </div>

              <div className="cd-negociacoes-container">
                <div className="cd-empty-state cd-empty-state-small">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p>Nenhuma negociação ativa</p>
                  <small>Suas negociações aparecerão aqui quando houver atividades.</small>
                </div>
              </div>
            </>
          )}

          {/* OUTRAS PÁGINAS */}
          {activePage !== "dashboard" && (
            <div className="cd-empty-state" style={{ padding: "60px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Em desenvolvimento</h2>
              <p style={{ color: "#718096" }}>Esta página será implementada em breve.</p>
            </div>
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
        .cd-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .cd-toast {
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
        .cd-toast.success { background: #10b981; color: white; }
        .cd-toast.error { background: #ef4444; color: white; }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .cd-btn-comprar {
          width: 100%;
          padding: 0.5rem;
          background: #1e3a5f;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .cd-btn-comprar:hover {
          background: #2d4a6e;
          transform: translateY(-1px);
        }
        
        .cd-header-left {
          flex: 1;
        }

        .cd-carrinho-badge {
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

        .cd-carrinho-status-pendente {
          font-size: 0.688rem;
          color: #f59e0b;
          margin-top: 4px;
        }

        .cd-carrinho-status-aprovado {
          font-size: 0.688rem;
          color: #10b981;
          margin-top: 4px;
        }

        /* Modal do Carrinho */
        .cd-modal-carrinho-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cd-modal-carrinho {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease;
        }

        .cd-modal-carrinho-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .cd-modal-carrinho-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #0f172a;
        }

        .cd-modal-carrinho-close {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .cd-modal-carrinho-close:hover {
          color: #ef4444;
        }

        .cd-modal-carrinho-body {
          padding: 1.5rem;
          max-height: 60vh;
          overflow-y: auto;
        }

        .cd-carrinho-vazio {
          text-align: center;
          padding: 2rem;
          color: #94a3b8;
        }

        .cd-carrinho-vazio svg {
          width: 48px;
          height: 48px;
          margin-bottom: 1rem;
          stroke: #94a3b8;
        }

        .cd-modal-carrinho-lista {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .cd-modal-carrinho-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 12px;
        }

        .cd-modal-carrinho-imagem {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
        }

        .cd-modal-carrinho-info {
          flex: 1;
        }

        .cd-modal-carrinho-nome {
          font-size: 0.875rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .cd-modal-carrinho-preco {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1e3a5f;
        }

        .cd-modal-carrinho-remover {
          padding: 0.5rem 1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cd-modal-carrinho-remover:hover {
          background: #dc2626;
        }

        .cd-modal-carrinho-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-top: 1px solid #e2e8f0;
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
        }

        .cd-modal-carrinho-finalizar {
          width: 100%;
          padding: 0.75rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 1rem;
        }

        .cd-modal-carrinho-finalizar:hover {
          background: #059669;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}