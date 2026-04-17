import { useState, useEffect } from "react";
import "./DashboardVendedor.css";
import CadastroProduto from './CadastroProduto';
import Vendas from "./Vendas";
import { productsAPI } from "../../api";

const menuItems = [
  { label: "Dashboard", icon: "⊞" },
  { label: "Vendas", icon: "🛒" },
  { label: "Meus Produtos", icon: "📋" },
  { label: "Intermediários", icon: "👥" },
  { label: "Adicionar produto", icon: "➕" },
];

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
  const [usuarioLogado, setUsuarioLogado] = useState({ nome: "", email: "", tipo_usuario: "", id: null });
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
        tipo_usuario: usuario.tipo_usuario || "",
        id: usuario.id
      });
    }
    
    fetchProdutos();
    fetchStats();
  }, []);

  const fetchProdutos = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token não encontrado");
        return;
      }
      
      const data = await productsAPI.getMyProducts(token);
      
      if (data.error) {
        console.error("Erro ao buscar produtos:", data.error);
      } else {
        setProdutos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token não encontrado");
        setLoading(false);
        return;
      }
      
      const data = await productsAPI.getStats(token);
      
      if (data.error) {
        console.error("Erro ao buscar estatísticas:", data.error);
      } else {
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
      const data = await productsAPI.updateStatus(token, produtoId, novoEstado);
      
      if (data.error) {
        alert(data.message || "Erro ao atualizar status");
      } else {
        await fetchProdutos();
        await fetchStats();
        alert(`Produto ${novoEstado === 'publicado' ? 'publicado' : 'salvo como rascunho'} com sucesso!`);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do produto");
    }
  };

  const handleDeleteProduct = async (produtoId) => {
    if (window.confirm("Tem certeza que deseja remover este produto?")) {
      try {
        const token = localStorage.getItem("accessToken");
        const data = await productsAPI.deleteProduct(token, produtoId);
        
        if (data.error) {
          alert(data.message || "Erro ao remover produto");
        } else {
          await fetchProdutos();
          await fetchStats();
          alert("Produto removido com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao remover produto:", error);
        alert("Erro ao remover produto");
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

  const statsCards = [
    { icon: "🗂️", label: "TOTAL DE PRODUTOS", value: stats.total_produtos || 0 },
    { icon: "✅", label: "PUBLICADOS", value: stats.produtos_publicados || 0 },
    { icon: "⏳", label: "AGUARDANDO", value: stats.aguardando_intermediario || 0 },
    { icon: "💰", label: "VENDIDOS", value: stats.vendidos || 0 },
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
                        <img src={p.foto_url || '/placeholder-image.jpg'} alt={p.nome} className="dv-produto-img" />
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
                        <img src={p.foto_url || '/placeholder-image.jpg'} alt={p.nome} className="dv-produto-img" />
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