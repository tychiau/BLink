import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import api, { intermediarioAPI, handleLogout } from "../../api";
import "./DashboardIntermediario.css";

const STAT_ICONS = {
  produtosAtivos: "📦",
  vendasRealizadas: "📈",
  comissaoMes: "💰",
  taxaConversao: "🎯",
};

const STATS_CONFIG = [
  { key: "produtosAtivos", badge: "+12%", badgeType: "green", label: "PRODUTOS ATIVOS" },
  { key: "vendasRealizadas", badge: "+5%", badgeType: "green", label: "VENDAS REALIZADAS" },
  { key: "comissaoMes", badge: "2.4k MZM", badgeType: "blue", label: "COMISSÃO DO MÊS", highlight: true },
  { key: "taxaConversao", badge: "High", badgeType: "orange", label: "TAXA DE CONVERSÃO" },
];

const STATS_VAZIOS = {
  produtosAtivos: "0",
  vendasRealizadas: "0",
  comissaoMes: "0 MZN",
  taxaConversao: "0%",
};

export default function DashboardIntermediario() {
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [stats, setStats] = useState(STATS_VAZIOS);
  const [aprovacoes, setAprovacoes] = useState([]);
  const [meusProdutosAtivos, setMeusProdutosAtivos] = useState([]);
  const [showPerfil, setShowPerfil] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [solicitandoId, setSolicitandoId] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);
  const perfilRef = useRef(null);

  // FUNÇÃO PARA EXECUTAR O LOGOUT CENTRALIZADO
  const executarLogout = () => {
    try {
      // Executa a limpeza de cookies/tokens configurada no seu ficheiro de api
      if (typeof handleLogout === "function") {
        handleLogout();
      }
    } catch (err) {
      console.error("Erro ao invocar handleLogout do ficheiro de api:", err);
    } finally {
      // Garante a limpeza local dos dados da sessão actual
      localStorage.removeItem('accessToken');
      localStorage.removeItem('blink_user');
      navigate('/auth');
    }
  };

  const verificarTipoUsuario = () => {
    const user = localStorage.getItem("blink_user");
    if (user) {
      const userData = JSON.parse(user);
      if (userData.tipo_usuario !== 'intermediario') {
        executarLogout();
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const fechar = (e) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target)) {
        setShowPerfil(false);
      }
    };
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, []);

  const fetchPerfil = async () => {
    setLoadingPerfil(true);
    try {
      const usuarioData = localStorage.getItem("blink_user");
      if (usuarioData) {
        const usuario = JSON.parse(usuarioData);
        setPerfil({
          id: usuario.id,
          nome: usuario.nome || "Intermediário",
          email: usuario.email || "intermediario@blink.co.mz",
          telefone: usuario.telefone || "+258 84 000 0000",
          localizacao: usuario.localizacao || "Maputo, Moçambique",
          criado_em: usuario.created_at || new Date().toISOString(),
        });
      } else {
        setPerfil({
          id: 48502,
          nome: "Manuel Intermediário",
          email: "manuel@blink.co.mz",
          telefone: "+258 84 123 4567",
          localizacao: "Maputo, Moçambique",
          criado_em: "2024-01-15T00:00:00.000Z",
        });
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleAvatarClick = () => {
    setShowPerfil(!showPerfil);
    if (!perfil) fetchPerfil();
  };

  const getToken = () => {
    return localStorage.getItem("accessToken");
  };

  const fetchProdutos = async () => {
    setLoadingProdutos(true);
    try {
      const token = getToken();
      if (!token) {
        executarLogout();
        return;
      }

      const data = await intermediarioAPI.getOportunidades(token);

      if (data.error) {
        if (data.status === 403 || data.status === 401) {
          console.error("Token inválido ou expirado.");
        }
        setProdutos([]);
        return;
      }

      if (Array.isArray(data)) {
        const produtosNaoSolicitados = data.filter(produto =>
          produto.status_solicitacao !== 'pendente' && produto.status_solicitacao !== 'aceite'
        );

        const produtosFormatados = produtosNaoSolicitados.map(produto => ({
          id: produto.id,
          name: produto.nome,
          seller: produto.vendedor_nome || "Vendedor",
          price: `MZN ${Number(produto.preco_minimo).toLocaleString()}`,
          preco_minimo: produto.preco_minimo,
          commission: `${produto.comissao_intermediario}%`,
          comissao_percentual: produto.comissao_intermediario,
          comissao_valor: (produto.preco_minimo * (produto.comissao_intermediario || 5)) / 100,
          img: produto.foto_url || "https://placehold.co/300x150/1e3a5f/ffffff?text=Produto",
          tag: produto.categoria_nome || "Produto",
          descricao: produto.descricao,
          provincia: produto.provincia,
          status_solicitacao: produto.status_solicitacao || null
        }));
        setProdutos(produtosFormatados);
      } else {
        setProdutos([]);
      }
    } catch (error) {
      console.error("Erro ao processar produtos:", error);
      setProdutos([]);
    } finally {
      setLoadingProdutos(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const data = await intermediarioAPI.getStats(token);

      if (data.error) return;

      if (data) {
        setStats({
          produtosAtivos: data.produtos_ativos?.toString() || "0",
          vendasRealizadas: data.vendas_realizadas?.toString() || "0",
          comissaoMes: `${Number(data.comissao_mes || 0).toLocaleString()} MZN`,
          taxaConversao: `${data.taxa_conversao || 0}%`,
        });
      }
    } catch (error) {
      console.error("Erro ao processar estatísticas:", error);
    }
  };

  const fetchMeusProdutos = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const data = await intermediarioAPI.getMeusProdutosAtivos(token);

      if (data.error) return;

      if (Array.isArray(data)) {
        const produtosFormatados = data.map(produto => ({
          id: produto.id,
          name: produto.nome,
          price: `MZN ${Number(produto.preco_minimo).toLocaleString()}`,
          commission: `${produto.comissao_intermediario}%`,
          img: produto.foto_url || "https://placehold.co/300x150/1e3a5f/ffffff?text=Produto",
          views: Math.floor(Math.random() * 100)
        }));
        setMeusProdutosAtivos(produtosFormatados);
      }
    } catch (error) {
      console.error("Erro ao processar meus produtos:", error);
    }
  };

  const fetchAprovacoesPendentes = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const data = await intermediarioAPI.getAprovacoesPendentes(token);

      if (data.error) return;

      if (Array.isArray(data)) {
        const aprovacoesFormatadas = data.map(item => ({
          id: item.id,
          produto_id: item.produto_id,
          name: item.produto_nome,
          seller: item.vendedor_nome,
          img: item.foto_url || "https://placehold.co/60x60/1e3a5f/ffffff?text=P",
          status: "Pendente",
          statusType: "pending",
          date: item.data_solicitacao || new Date().toLocaleDateString('pt-MZ')
        }));
        setAprovacoes(aprovacoesFormatadas);
      } else {
        setAprovacoes([]);
      }
    } catch (error) {
      console.error("Erro ao processar aprovações pendentes:", error);
      setAprovacoes([]);
    }
  };

  const handleSolicitarIntermediacao = async (produtoId) => {
    setSolicitandoId(produtoId);
    try {
      const token = getToken();
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        executarLogout();
        return;
      }

      const result = await intermediarioAPI.solicitarIntermediacao(token, produtoId);

      if (!result.error) {
        alert("Solicitação enviada com sucesso!");
        await loadAllData();
      } else {
        alert(`Erro: ${result.message || 'Erro ao solicitar'}`);
      }
    } catch (error) {
      alert("Erro ao conectar ao servidor: " + error.message);
    } finally {
      setSolicitandoId(null);
    }
  };

  const handleCancelarSolicitacao = async (solicitacaoId, produtoId) => {
    setCancelandoId(solicitacaoId);
    try {
      const token = getToken();
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        executarLogout();
        return;
      }

      const result = await intermediarioAPI.cancelarSolicitacao(token, solicitacaoId);

      if (!result.error) {
        alert("Solicitação cancelada com sucesso!");
        await loadAllData();
      } else {
        alert(`Erro: ${result.message || 'Erro ao cancelar solicitação'}`);
      }
    } catch (error) {
      alert("Erro ao conectar ao servidor: " + error.message);
    } finally {
      setCancelandoId(null);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProdutos(),
      fetchStats(),
      fetchMeusProdutos(),
      fetchAprovacoesPendentes()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (!verificarTipoUsuario()) return;
    fetchPerfil();
    loadAllData();
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      executarLogout();
    }
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <span className="logo">BLINK</span>
          <nav className="header-nav">
            <a href="#">Categorias</a>
            <a href="#">Como Funciona</a>
            <a href="#" className="active">Área do Intermediário</a>
          </nav>
          <div className="header-right">
            <div className="header-user" style={{ position: 'relative' }} ref={perfilRef}>
              <div className="header-user-info">
                <div className="header-user-name">
                  {perfil ? perfil.nome : 'Intermediário'}
                </div>
                <div className="header-user-id">
                  ID {perfil ? perfil.id : '---'}
                </div>
              </div>

              <div
                className="avatar"
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={handleAvatarClick}
                title="Ver perfil"
              >
                {perfil ? perfil.nome.charAt(0).toUpperCase() : 'I'}
              </div>

              {showPerfil && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  minWidth: '270px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.13)',
                  zIndex: 999,
                }}>
                  {loadingPerfil ? (
                    <p style={{ textAlign: 'center', color: '#888', margin: 0 }}>A carregar...</p>
                  ) : !perfil ? (
                    <p style={{ textAlign: 'center', color: '#e55', margin: 0 }}>Erro ao carregar perfil.</p>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: '#6366f1', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '20px', flexShrink: 0
                        }}>
                          {perfil.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '15px', color: '#111' }}>{perfil.nome}</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>ID {perfil.id}</div>
                        </div>
                      </div>

                      <hr style={{ margin: '0 0 14px', borderColor: '#f0f0f0', borderStyle: 'solid' }} />

                      <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#333' }}>
                        <div>📧 <strong>Email:</strong> {perfil.email}</div>
                        <div>📞 <strong>Telefone:</strong> {perfil.telefone}</div>
                        <div>📍 <strong>Localização:</strong> {perfil.localizacao}</div>
                        <div>📅 <strong>Membro desde:</strong> {new Date(perfil.criado_em).toLocaleDateString('pt-MZ')}</div>
                      </div>

                      <hr style={{ margin: '14px 0 12px', borderColor: '#f0f0f0', borderStyle: 'solid' }} />

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          flex: 1, padding: '8px', border: 'none',
                          borderRadius: '8px', background: '#6366f1',
                          color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '500'
                        }}>
                          Editar Perfil
                        </button>
                        {/* 2. BOTÃO ALTERADO PARA CHAMAR A FUNÇÃO DE LOGOUT CENTRALIZADA */}
                        <button
                          onClick={executarLogout}
                          style={{
                            flex: 1, padding: '8px', border: 'none',
                            borderRadius: '8px', background: '#ef4444',
                            cursor: 'pointer', fontSize: '13px', color: '#fff'
                          }}
                        >
                          Sair
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button className="icon-btn" onClick={() => navigate('/intermediario/solicitacoes')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <button className="icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-wrapper">
        <aside className="sidebar">
          <div className="sidebar-profile">
            <div className="sidebar-label" style={{ textAlign: 'left', width: '100%' }}>PAINEL INTERMEDIÁRIO</div>
            <div className="sidebar-name" style={{ textAlign: 'left', width: '100%' }}>Minha Conta</div>
            <nav className="sidebar-nav">
              {[
                {
                  label: "DASHBOARD", active: true,
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                },
                {
                  label: "NOVOS PRODUTOS",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                },
                {
                  label: "MEUS PRODUTOS",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                },
                {
                  label: "GANHOS",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                },
              ].map((item) => (
                <button key={item.label} className={`nav-item${item.active ? " active" : ""}`}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="sidebar-support">
            <div className="support-label" style={{ textAlign: 'left', width: '100%' }}>SUPORTE DIRETO</div>
            <button className="btn-support">FALAR COM CONSULTOR</button>
          </div>
        </aside>

        <main className="main-content">
          <div className="stats-grid">
            {STATS_CONFIG.map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-top">
                  <span className="stat-icon">{STAT_ICONS[s.key]}</span>
                  <span className={`stat-badge ${s.badgeType}`}>{s.badge}</span>
                </div>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-value${s.highlight ? " highlight" : ""}`}>
                  {stats[s.key]}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="section-header">
              <div className="section-header-left">
                <div className="section-title">Produtos Disponíveis</div>
                <div className="section-sub">Todos os produtos publicados no marketplace.</div>
              </div>
              <button className="btn-filter" onClick={loadAllData}>⟳ Atualizar</button>
            </div>

            {loadingProdutos ? (
              <div className="empty-state">
                <div className="spinner"></div>
                <p>Carregando produtos...</p>
              </div>
            ) : produtos.length === 0 ? (
              <div className="empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <p>Nenhum produto disponível no momento</p>
                <small>Você já solicitou todos os produtos disponíveis ou não há produtos publicados.</small>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {produtos.map((p) => (
                    <div className="product-card" key={p.id}>
                      <div className="product-img-wrap">
                        <img src={p.img} alt={p.name} loading="lazy" />
                        <span className="product-tag">{p.tag}</span>
                      </div>
                      <div className="product-body">
                        <div className="product-seller">{p.seller}</div>
                        <div className="product-name">{p.name}</div>
                        <div className="product-pricing">
                          <div className="price-col">
                            <label>PREÇO</label>
                            <span className="price">{p.price}</span>
                          </div>
                          <div className="price-col">
                            <label>SUA COMISSÃO</label>
                            <span className="commission" style={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}>
                              MZN {p.comissao_valor.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                        <button
                          className="btn-vincular"
                          onClick={() => handleSolicitarIntermediacao(p.id)}
                          disabled={solicitandoId === p.id}
                        >
                          {solicitandoId === p.id ? "Enviando..." : "📌 Solicitar Intermediação"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 20, padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                  <small style={{ color: '#64748b' }}>Total de {produtos.length} produto(s) disponível(is)</small>
                </div>
              </>
            )}
          </div>

          <div className="bottom-grid">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Solicitações Pendentes</div>
                {aprovacoes.length > 0 && <a className="card-link">Ver todos</a>}
              </div>
              {aprovacoes.length === 0 ? (
                <div className="empty-state-small">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 8v4l3 3M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
                  </svg>
                  <p>Sem solicitações pendentes</p>
                  <small>Suas solicitações aparecerão aqui aguardando aprovação do vendedor.</small>
                </div>
              ) : (
                aprovacoes.map((a) => (
                  <div className="approval-item" key={a.id}>
                    <img className="approval-thumb" src={a.img} alt={a.name} />
                    <div className="approval-info">
                      <div className="approval-name">{a.name}</div>
                      <div className="approval-seller">{a.seller}</div>
                    </div>
                    <div className="approval-right">
                      <span className={`status-badge ${a.statusType}`}>{a.status}</span>
                      <div className="approval-date">{a.date}</div>
                      <button
                        className="btn-cancelar"
                        onClick={() => handleCancelarSolicitacao(a.id, a.produto_id)}
                        disabled={cancelandoId === a.id}
                        style={{
                          marginTop: '8px',
                          padding: '4px 12px',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {cancelandoId === a.id ? "Cancelando..." : "Cancelar Solicitação"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Meus Produtos Ativos</div>
                {meusProdutosAtivos.length > 0 && <a className="card-link">Ver todos</a>}
              </div>
              {meusProdutosAtivos.length === 0 ? (
                <div className="empty-state-small">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  <p>Nenhum produto ativo</p>
                  <small>Aguardando aprovação dos vendedores.</small>
                </div>
              ) : (
                meusProdutosAtivos.map((produto, index) => (
                  <div className="active-product" key={index}>
                    <img className="active-thumb" src={produto.img} alt={produto.name} />
                    <div className="active-info">
                      <div className="active-views">{produto.views} views</div>
                      <div className="active-name">{produto.name}</div>
                      <div className="active-meta">Preço: {produto.price} • Comissão: {produto.commission}</div>
                    </div>
                    <div className="active-actions">
                      <button className="btn-link">Link de Venda</button>
                      <button className="btn-whatsapp">WhatsApp</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <footer className="footer">
        <div className="footer-inner" style={{ textAlign: 'left' }}>
          <div className="footer-brand" style={{ textAlign: 'left' }}>
            <span className="logo" style={{ textAlign: 'left', display: 'block' }}>BLINK</span>
            <p style={{ textAlign: 'left', marginLeft: '20px', marginTop: '20px' }}>Conectando produtos de qualidade ao mercado local.</p>
          </div>
          <div className="footer-col" style={{ textAlign: 'left' }}>
            <h4 style={{ textAlign: 'left' }}>Plataforma</h4>
            <a href="#" style={{ textAlign: 'left', display: 'block' }}>Sobre</a>
            <a href="#" style={{ textAlign: 'left', display: 'block' }}>Como Funciona</a>
            <a href="#" style={{ textAlign: 'left', display: 'block' }}>Preços</a>
          </div>
          <div className="footer-col" style={{ textAlign: 'left' }}>
            <h4 style={{ textAlign: 'left' }}>Suporte</h4>
            <a href="#" style={{ textAlign: 'left', display: 'block' }}>FAQ</a>
            <a href="#" style={{ textAlign: 'left', display: 'block' }}>Termos</a>
            <a href="#" style={{ textAlign: 'left', display: 'block' }}>Privacidade</a>
          </div>
          <div className="footer-col" style={{ textAlign: 'left' }}>
            <h4 style={{ textAlign: 'left' }}>Contato</h4>
            <p style={{ textAlign: 'left' }}>Maputo, Moçambique</p>
            <p style={{ textAlign: 'left' }}>suporte@blink.co.mz</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
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
        .btn-cancelar {
          transition: all 0.2s ease;
        }
        .btn-cancelar:hover:not(:disabled) {
          background: #dc2626 !important;
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
}