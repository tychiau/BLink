import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardVendedor.css";
import CadastroProduto from './CadastroProduto';
import Vendas from "./Vendas";
import { productsAPI } from "../../api";

const menuItems = [
  { label: "Dashboard", icon: "⊞" },
  { label: "Vendas", icon: "🛒" },
  { label: "Meus Produtos", icon: "📋" },
  { label: "Intermediarios", icon: "👥" },
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
  const navigate = useNavigate()
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
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [comissaoPercentual, setComissaoPercentual] = useState(5);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    const usuarioData = localStorage.getItem("blink_user");
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      setUsuarioLogado({
        nome: usuario.nome || "Usuario",
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
      setError(null);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token nao encontrado");
        setError("Token de autenticacao nao encontrado");
        return;
      }
      
      const data = await productsAPI.getMyProducts(token);
      
      if (data.error) {
        console.error("Erro ao buscar produtos:", data.error);
        setError(data.message || "Erro ao buscar produtos");
      } else {
        setProdutos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setError(error.message || "Erro de conexao ao buscar produtos");
    }
  };
  
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token nao encontrado");
        setLoading(false);
        return;
      }
      
      const data = await productsAPI.getStats(token);
      
      if (data.error) {
        console.error("Erro ao buscar estatisticas:", data.error);
      } else {
        setStats({
          total_produtos: data.total_produtos || 0,
          produtos_publicados: data.produtos_publicados || 0,
          aguardando_intermediario: data.aguardando_intermediario || 0,
          rascunhos: data.rascunhos || 0,
          vendidos: data.vendidos || 0
        });
      }
    } catch (error) {
      console.error("Erro ao buscar estatisticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProdutos();
    await fetchStats();
    setRefreshing(false);
    showNotification("Produtos recarregados com sucesso!", "success");
  };

  const handleStatusChange = async (produtoId, novoEstado) => {
    try {
      const token = localStorage.getItem("accessToken");
      const data = await productsAPI.updateStatus(token, produtoId, novoEstado);
      
      if (data.error) {
        showNotification(data.message || "Erro ao atualizar status", "error");
      } else {
        await fetchProdutos();
        await fetchStats();
        const mensagem = novoEstado === 'publicado' 
          ? 'Produto publicado com sucesso!' 
          : 'Produto guardado como rascunho';
        showNotification(mensagem, "success");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      showNotification("Erro ao atualizar status do produto", "error");
    }
  };

  const handleDeleteProduct = async (produtoId) => {
    if (window.confirm("Tem certeza que deseja remover este produto?")) {
      try {
        const token = localStorage.getItem("accessToken");
        const data = await productsAPI.deleteProduct(token, produtoId);
        
        if (data.error) {
          showNotification(data.message || "Erro ao remover produto", "error");
        } else {
          await fetchProdutos();
          await fetchStats();
          showNotification("Produto removido com sucesso!", "success");
        }
      } catch (error) {
        console.error("Erro ao remover produto:", error);
        showNotification("Erro ao remover produto", "error");
      }
    }
  };

  const handleEditProduct = (produto) => {
    let percentual = 5;
    if (produto.preco_minimo > 0 && produto.comissao_intermediario > 0) {
      percentual = (produto.comissao_intermediario / produto.preco_minimo) * 100;
      if (percentual > 100) percentual = 100;
      if (percentual < 1) percentual = 1;
    }
    
    setComissaoPercentual(Math.round(percentual * 10) / 10);
    setEditingProduct({ ...produto });
    setShowEditModal(true);
  };

  const handlePrecoChange = (novoPreco) => {
    const preco = parseFloat(novoPreco) || 0;
    const novaComissao = (preco * comissaoPercentual) / 100;
    
    setEditingProduct({
      ...editingProduct,
      preco_minimo: preco,
      comissao_intermediario: novaComissao
    });
  };

  const handleComissaoPercentualChange = (percentual) => {
    let novoPercentual = parseFloat(percentual) || 0;
    if (novoPercentual > 100) novoPercentual = 100;
    if (novoPercentual < 1) novoPercentual = 1;
    
    setComissaoPercentual(novoPercentual);
    
    const preco = editingProduct?.preco_minimo || 0;
    const novaComissao = (preco * novoPercentual) / 100;
    
    setEditingProduct({
      ...editingProduct,
      comissao_intermediario: novaComissao
    });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    if (!editingProduct.nome || editingProduct.nome.trim() === '') {
      showNotification("O nome do produto e obrigatorio", "error");
      return;
    }
    
    if (!editingProduct.preco_minimo || editingProduct.preco_minimo <= 0) {
      showNotification("O preco deve ser maior que zero", "error");
      return;
    }
    
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showNotification("Token de autenticacao nao encontrado", "error");
        return;
      }
      
      const productData = {
        nome: editingProduct.nome,
        descricao: editingProduct.descricao || '',
        preco_minimo: parseFloat(editingProduct.preco_minimo),
        comissao_intermediario: parseFloat(editingProduct.comissao_intermediario || 0),
        categoria_id: editingProduct.categoria_id || null
      };
      
      const data = await productsAPI.updateProduct(token, editingProduct.id, productData);
      
      if (data.error) {
        showNotification(data.message || "Erro ao atualizar produto", "error");
      } else {
        await fetchProdutos();
        await fetchStats();
        setShowEditModal(false);
        setEditingProduct(null);
        showNotification("Produto atualizado com sucesso!", "success");
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      showNotification("Erro ao atualizar produto", "error");
    }
  };

  const handleProductAdded = () => {
    fetchProdutos();
    fetchStats();
    setActivePage("Meus Produtos");
    showNotification("Produto adicionado com sucesso!", "success");
  };

  const getInicial = (nome) => {
    return nome ? nome.charAt(0).toUpperCase() : "?";
  };

  const getPapelUsuario = (tipo) => {
    switch(tipo) {
      case 'vendedor': return 'Vendedor';
      case 'intermediario': return 'Intermediario';
      case 'cliente': return 'Cliente';
      default: return 'Usuario';
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
      {notification.show && (
        <div className={`dv-toast-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <nav className="dv-navbar">
        <span className="dv-logo">BLINK</span>
        <div className="dv-search-wrapper">
          <span className="dv-search-icon">🔍</span>
          <input className="dv-search" type="text" placeholder="Pesquisar produtos ou pedidos..." />
        </div>
        <div className="dv-nav-icons">
          <button className="dv-icon-btn" onClick={() => navigate('/vendedor/solicitacoes')}>🔔</button>
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
          {error && (
            <div style={{ backgroundColor: '#fee', color: '#c00', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
              Erro: {error}
            </div>
          )}

          {activePage === "Dashboard" && (
            <>
              <div className="dv-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <h1 className="dv-welcome">Bem-vindo de volta, {usuarioLogado.nome.split(' ')[0]}</h1>
                    <p className="dv-welcome-sub">Aqui esta o resumo do seu marketplace hoje.</p>
                  </div>
                  <button 
                    onClick={handleRefresh} 
                    disabled={refreshing}
                    style={{
                      padding: '8px 16px',
                      background: '#2d4a6e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: refreshing ? 'not-allowed' : 'pointer',
                      opacity: refreshing ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <span>🔄</span>
                    {refreshing ? 'A recarregar...' : 'Recarregar Produtos'}
                  </button>
                </div>
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
                        <img 
                          src={p.foto_url || '/placeholder-image.jpg'} 
                          alt={p.nome} 
                          className="dv-produto-img"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x200/2d3748/ffffff?text=Sem+Imagem';
                          }}
                        />
                        <span className={`dv-produto-badge ${estadoConfig.class}`}>{estadoConfig.label}</span>
                      </div>
                      <div className="dv-produto-info">
                        <span className="dv-produto-categoria">{p.categoria_id || "Sem categoria"}</span>
                        <div className="dv-produto-nome-preco">
                          <p className="dv-produto-nome">{p.nome}</p>
                          <p className="dv-produto-preco">MZN {parseFloat(p.preco_minimo).toLocaleString()}</p>
                        </div>
                        <p className="dv-produto-intermediarios">Comissao: MZN {parseFloat(p.comissao_intermediario || 0).toLocaleString()}</p>
                        <div className="dv-produto-acoes">
                          <button 
                            className="dv-acao-btn dv-acao-editar" 
                            onClick={() => handleEditProduct(p)}
                            style={{
                              padding: '6px 12px',
                              background: '#2d4a6e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginRight: '8px'
                            }}
                          >
                            Editar
                          </button>
                          {p.estado === 'publicado' ? (
                            <button 
                              className="dv-acao-btn dv-acao-pausar" 
                              onClick={() => handleStatusChange(p.id, 'rascunho')}
                              style={{
                                padding: '6px 12px',
                                background: '#F59E0B',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                marginRight: '8px'
                              }}
                            >
                              Guardar como Rascunho
                            </button>
                          ) : p.estado === 'rascunho' ? (
                            <button 
                              className="dv-acao-btn dv-acao-publicar" 
                              onClick={() => handleStatusChange(p.id, 'publicado')}
                              style={{
                                padding: '6px 12px',
                                background: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                marginRight: '8px'
                              }}
                            >
                              Publicar
                            </button>
                          ) : null}
                          <button 
                            className="dv-acao-btn dv-acao-excluir" 
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{
                              padding: '6px 12px',
                              background: '#EF4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {produtos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>Voce ainda nao tem produtos cadastrados.</p>
                  <button 
                    onClick={() => setActivePage("Adicionar produto")}
                    style={{ marginTop: '10px', padding: '10px 20px', background: '#2d4a6e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Adicionar Produto
                  </button>
                </div>
              )}
            </>
          )}

          {activePage === "Vendas" && <Vendas />}

          {activePage === "Meus Produtos" && (
            <div className="dv-produtos-list">
              <div className="dv-section-header">
                <h2 className="dv-section-title">Todos os Meus Produtos</h2>
                <button 
                  onClick={handleRefresh} 
                  disabled={refreshing}
                  style={{
                    padding: '6px 12px',
                    background: '#2d4a6e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: refreshing ? 'not-allowed' : 'pointer',
                    opacity: refreshing ? 0.6 : 1,
                    fontSize: '12px'
                  }}
                >
                  {refreshing ? 'A recarregar...' : 'Recarregar'}
                </button>
              </div>
              <div className="dv-produtos-grid">
                {produtos.map((p) => {
                  const estadoConfig = getEstadoConfig(p.estado);
                  return (
                    <div className="dv-produto-card" key={p.id}>
                      <div className="dv-produto-img-wrapper">
                        <img 
                          src={p.foto_url || '/placeholder-image.jpg'} 
                          alt={p.nome} 
                          className="dv-produto-img"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x200/2d3748/ffffff?text=Sem+Imagem';
                          }}
                        />
                        <span className={`dv-produto-badge ${estadoConfig.class}`}>{estadoConfig.label}</span>
                      </div>
                      <div className="dv-produto-info">
                        <span className="dv-produto-categoria">{p.categoria_id || "Sem categoria"}</span>
                        <div className="dv-produto-nome-preco">
                          <p className="dv-produto-nome">{p.nome}</p>
                          <p className="dv-produto-preco">MZN {parseFloat(p.preco_minimo).toLocaleString()}</p>
                        </div>
                        <p className="dv-produto-intermediarios">Comissao: MZN {parseFloat(p.comissao_intermediario || 0).toLocaleString()}</p>
                        <div className="dv-produto-acoes">
                          <button 
                            className="dv-acao-btn dv-acao-editar" 
                            onClick={() => handleEditProduct(p)}
                            style={{
                              padding: '6px 12px',
                              background: '#2d4a6e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginRight: '8px'
                            }}
                          >
                            Editar
                          </button>
                          {p.estado === 'publicado' ? (
                            <button 
                              className="dv-acao-btn dv-acao-pausar" 
                              onClick={() => handleStatusChange(p.id, 'rascunho')}
                              style={{
                                padding: '6px 12px',
                                background: '#F59E0B',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                marginRight: '8px'
                              }}
                            >
                              Guardar como Rascunho
                            </button>
                          ) : p.estado === 'rascunho' ? (
                            <button 
                              className="dv-acao-btn dv-acao-publicar" 
                              onClick={() => handleStatusChange(p.id, 'publicado')}
                              style={{
                                padding: '6px 12px',
                                background: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                marginRight: '8px'
                              }}
                            >
                              Publicar
                            </button>
                          ) : null}
                          <button 
                            className="dv-acao-btn dv-acao-excluir" 
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{
                              padding: '6px 12px',
                              background: '#EF4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {produtos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>Nenhum produto encontrado.</p>
                </div>
              )}
            </div>
          )}

          {activePage === "Intermediarios" && (
            <div className="dv-em-breve">
              <span>👥</span>
              <h2>Intermediarios</h2>
              <p>Em construcao...</p>
            </div>
          )}

          {activePage === "Adicionar produto" && (
            <CadastroProduto onProductAdded={handleProductAdded} />
          )}
        </main>
      </div>

      {/* Modal de Edicao - CORRIGIDO */}
      {showEditModal && editingProduct && (
        <div className="dv-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="dv-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="dv-modal-header">
              <h3>Editar Produto</h3>
              <button className="dv-modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="dv-modal-body">
              <div className="dv-form-group">
                <label className="dv-label">NOME DO PRODUTO</label>
                <input 
                  type="text" 
                  className="dv-input"
                  value={editingProduct.nome || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, nome: e.target.value})}
                />
              </div>
              <div className="dv-form-group">
                <label className="dv-label">DESCRICAO</label>
                <textarea 
                  className="dv-textarea"
                  rows="3"
                  value={editingProduct.descricao || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, descricao: e.target.value})}
                />
              </div>
              <div className="dv-form-group">
                <label className="dv-label">PRECO (MZN)</label>
                <input 
                  type="number" 
                  className="dv-input"
                  step="0.01"
                  value={editingProduct.preco_minimo || ''}
                  onChange={(e) => handlePrecoChange(e.target.value)}
                />
              </div>
              <div className="dv-form-group">
                <label className="dv-label">COMISSAO (%)</label>
                <input 
                  type="number" 
                  className="dv-input"
                  step="0.5"
                  min="1"
                  max="100"
                  value={comissaoPercentual}
                  onChange={(e) => handleComissaoPercentualChange(e.target.value)}
                />
                <small className="dv-hint">Comissao permitida entre 1% e 100%</small>
              </div>
              <div className="dv-form-group">
                <label className="dv-label">VALOR DA COMISSAO (MZN)</label>
                <input 
                  type="text" 
                  className="dv-input"
                  value={editingProduct.comissao_intermediario?.toFixed(2) || '0.00'}
                  disabled
                  style={{ backgroundColor: '#f5f5f5' }}
                />
                <small className="dv-hint">Valor calculado automaticamente</small>
              </div>
            </div>
            <div className="dv-modal-footer">
              <button className="dv-btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
              <button className="dv-btn-save" onClick={handleUpdateProduct}>
                Salvar Alteracoes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}