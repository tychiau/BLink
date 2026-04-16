import { useState, useEffect } from "react";
import "./DashboardVendedor.css";
import CadastroProduto from './CadastroProduto';
import Vendas from "./Vendas";

const menuItems = [
  { label: "Dashboard", icon: "⊞" },
  { label: "Vendas", icon: "🛒" },
  { label: "Meus Produtos", icon: "📋" },
  { label: "Intermediários", icon: "👥" },
  { label: "Adicionar produto", icon: "➕" }, // Botão ADICIONADO de volta na lateral
];

// Mapeamento de estados para português e cores
const getEstadoConfig = (estado) => {
  const configs = {
    'rascunho': { label: 'RASCUNHO', class: 'dv-badge--rascunho' },
    'aguardando_intermediario': { label: 'AGUARDANDO', class: 'dv-badge--aguardando' },
    'publicado': { label: 'PUBLICADO', class: 'dv-badge--publicado' },
    'vendido': { label: 'VENDIDO', class: 'dv-badge--vendido' },
    'removido': { label: 'REMOVIDO', class: 'dv-badge--removido' }
  };
  return configs[estado] || { label: estado.toUpperCase(), class: '' };
};

export default function DashboardVendedor() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [usuarioLogado, setUsuarioLogado] = useState({ nome: "", email: "", tipo_usuario: "" });
  const [produtos, setProdutos] = useState([]);
  const [stats, setStats] = useState({
    total_produtos: 0,
    produtos_publicados: 0,
    aguardando_intermediario: 0,
    rascunhos: 0,
    vendidos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioData = localStorage.getItem("blink_user");
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      setUsuarioLogado({
        nome: usuario.nome || "Usuário",
        email: usuario.email || "",
        tipo_usuario: usuario.tipo_usuario || ""
      });
    }
    
    // Buscar produtos e estatísticas
    fetchProdutos();
    fetchStats();
  }, []);

  const fetchProdutos = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch('http://localhost:5173/api/products/meus-produtos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProdutos(data);
      } else if (response.status === 401) {
        console.error("Não autorizado");
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch('http://localhost:5173/api/products/meus-produtos/estatisticas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (produtoId, novoEstado) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:5173/api/products/produto/${produtoId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: novoEstado })
      });
      
      if (response.ok) {
        fetchProdutos();
        fetchStats();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDeleteProduct = async (produtoId) => {
    if (window.confirm("Tem certeza que deseja remover este produto?")) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:5173/api/products/produto/${produtoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          fetchProdutos();
          fetchStats();
        }
      } catch (error) {
        console.error("Erro ao remover produto:", error);
      }
    }
  };

  const getInicial = (nome) => {
    return nome ? nome.charAt(0).toUpperCase() : "?";
  };

  const getPapelUsuario = (tipo) => {
    switch(tipo) {
      case 'vendedor': return 'Vendedor';
      case 'intermediario': return 'Intermediário';
      case 'cliente': return 'Cliente';
      default: return 'Usuário';
    }
  };

  // Estatísticas para os cards do dashboard
  const statsCards = [
    { icon: "🗂️", label: "TOTAL DE PRODUTOS", value: stats.total_produtos, change: "", up: null },
    { icon: "✅", label: "PUBLICADOS", value: stats.produtos_publicados, change: "", up: null },
    { icon: "⏳", label: "AGUARDANDO", value: stats.aguardando_intermediario, change: "", up: null },
    { icon: "💰", label: "VENDIDOS", value: stats.vendidos, change: "", up: null },
  ];

  if (loading) {
    return <div className="dv-root"><div style={{ textAlign: 'center', padding: '50px' }}>Carregando...</div></div>;
  }

  return (
    <div className="dv-root">
      <nav className="dv-navbar">
        <span className="dv-logo">BLINK</span>
        <div className="dv-search-wrapper">
          <span className="dv-search-icon">🔍</span>
          <input className="dv-search" type="text" placeholder="Pesquisar produtos ou pedidos..." />
        </div>
        <div className="dv-nav-icons">
          <button className="dv-icon-btn">🔔</button>
          <button className="dv-icon-btn">✉️</button>
          <div className="dv-avatar">{getInicial(usuarioLogado.nome)} <span>▾</span></div>
        </div>
      </nav>

      <div className="dv-body">
        <aside className="dv-sidebar">
          <nav className="dv-menu">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`dv-menu-item ${activePage === item.label ? "dv-menu-item--active" : ""}`}
                onClick={() => setActivePage(item.label)}
              >
                <span className="dv-menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="dv-sidebar-profile">
            <div className="dv-profile-avatar">{getInicial(usuarioLogado.nome)}</div>
            <div className="dv-profile-info">
              <p className="dv-profile-name">{usuarioLogado.nome}</p>
              <p className="dv-profile-role">{getPapelUsuario(usuarioLogado.tipo_usuario)}</p>
            </div>
          </div>
        </aside>

        <main className="dv-main">
          {activePage === "Dashboard" && (
            <>
              <div className="dv-header">
                <h1 className="dv-welcome">Bem-vindo de volta, {usuarioLogado.nome.split(' ')[0]}</h1>
                <p className="dv-welcome-sub">Aqui está o resumo do seu marketplace hoje.</p>
              </div>
              
              <div className="dv-stats-grid">
                {statsCards.map((s) => (
                  <div className="dv-stat-card" key={s.label}>
                    <div className="dv-stat-top">
                      <div className="dv-stat-icon-box">{s.icon}</div>
                    </div>
                    <p className="dv-stat-label">{s.label}</p>
                    <p className="dv-stat-value">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="dv-section-header">
                <h2 className="dv-section-title">Meus Produtos</h2>
                <button className="dv-ver-todos" onClick={() => setActivePage("Meus Produtos")}>Ver todos</button>
              </div>

              <div className="dv-produtos-grid">
                {produtos.slice(0, 4).map((p) => {
                  const estadoConfig = getEstadoConfig(p.estado);
                  return (
                    <div className="dv-produto-card" key={p.id}>
                      <div className="dv-produto-img-wrapper">
                        <img src={p.foto_url} alt={p.nome} className="dv-produto-img" />
                        <span className={`dv-produto-badge ${estadoConfig.class}`}>{estadoConfig.label}</span>
                      </div>
                      <div className="dv-produto-info">
                        <span className="dv-produto-categoria">{p.categoria_id || "Sem categoria"}</span>
                        <div className="dv-produto-nome-preco">
                          <p className="dv-produto-nome">{p.nome}</p>
                          <p className="dv-produto-preco">MZN {parseFloat(p.preco_minimo).toLocaleString()}</p>
                        </div>
                        <p className="dv-produto-intermediarios">💸 Comissão: MZN {parseFloat(p.comissao_intermediario || 0).toLocaleString()}</p>
                        <div className="dv-produto-acoes">
                          <button className="dv-acao-btn" title="Editar">✏️</button>
                          {p.estado === 'publicado' ? (
                            <button className="dv-acao-btn" title="Pausar" onClick={() => handleStatusChange(p.id, 'rascunho')}>⏸️</button>
                          ) : p.estado === 'rascunho' ? (
                            <button className="dv-acao-btn" title="Publicar" onClick={() => handleStatusChange(p.id, 'publicado')}>📢</button>
                          ) : null}
                          <button className="dv-acao-btn" title="Eliminar" onClick={() => handleDeleteProduct(p.id)}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {produtos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>Você ainda não tem produtos cadastrados.</p>
                  {/* Botão REMOVIDO daqui */}
                </div>
              )}
            </>
          )}

          {activePage === "Vendas" && <Vendas />}

          {activePage === "Meus Produtos" && (
            <div className="dv-produtos-list">
              <div className="dv-section-header">
                <h2 className="dv-section-title">Todos os Meus Produtos</h2>
              </div>
              <div className="dv-produtos-grid">
                {produtos.map((p) => {
                  const estadoConfig = getEstadoConfig(p.estado);
                  return (
                    <div className="dv-produto-card" key={p.id}>
                      <div className="dv-produto-img-wrapper">
                        <img src={p.foto_url} alt={p.nome} className="dv-produto-img" />
                        <span className={`dv-produto-badge ${estadoConfig.class}`}>{estadoConfig.label}</span>
                      </div>
                      <div className="dv-produto-info">
                        <span className="dv-produto-categoria">{p.categoria_id || "Sem categoria"}</span>
                        <div className="dv-produto-nome-preco">
                          <p className="dv-produto-nome">{p.nome}</p>
                          <p className="dv-produto-preco">MZN {parseFloat(p.preco_minimo).toLocaleString()}</p>
                        </div>
                        <p className="dv-produto-intermediarios">💸 Comissão: MZN {parseFloat(p.comissao_intermediario || 0).toLocaleString()}</p>
                        <div className="dv-produto-acoes">
                          <button className="dv-acao-btn" title="Editar">✏️</button>
                          {p.estado === 'publicado' ? (
                            <button className="dv-acao-btn" title="Pausar" onClick={() => handleStatusChange(p.id, 'rascunho')}>⏸️</button>
                          ) : p.estado === 'rascunho' ? (
                            <button className="dv-acao-btn" title="Publicar" onClick={() => handleStatusChange(p.id, 'publicado')}>📢</button>
                          ) : null}
                          <button className="dv-acao-btn" title="Eliminar" onClick={() => handleDeleteProduct(p.id)}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activePage === "Intermediários" && (
            <div className="dv-em-breve">
              <span>👥</span>
              <h2>Intermediários</h2>
              <p>Em construção...</p>
            </div>
          )}

          {activePage === "Adicionar produto" && (
            <CadastroProduto onProductAdded={() => {
              fetchProdutos();
              fetchStats();
              setActivePage("Meus Produtos");
            }} />
          )}
        </main>
      </div>
    </div>
  );
}