import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardVendedor.css";
import CadastroProduto from './CadastroProduto';
import Vendas from "./Vendas";
import { productsAPI } from "../../api";



// Ícones profissionais em SVG - Azul #1e3a5f
const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconVendas = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconProdutos = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path>
    <line x1="16" y1="5" x2="8" y2="5"></line>
  </svg>
);

const IconIntermediarios = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconAdicionar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconTotalProdutos = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const IconPublicados = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconAguardando = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconVendidos = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

const IconPesquisa = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconNotificacao = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const IconMensagem = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconRecarregar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4"></path>
    <path d="M12 17h.01"></path>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
  </svg>
);

const menuItemsConfig = [
  { label: "Dashboard", icon: <IconDashboard /> },
  { label: "Vendas", icon: <IconVendas /> },
  { label: "Meus Produtos", icon: <IconProdutos /> },
  { label: "Intermediarios", icon: <IconIntermediarios /> },
  { label: "Adicionar produto", icon: <IconAdicionar /> },
];

const getEstadoConfig = (estado) => {
  const configs = {
    rascunho: { label: "Rascunho" },
    aguardando_intermediario: { label: "Aguardando" },
    publicado: { label: "Publicado" },
    vendido: { label: "Vendido" },
    removido: { label: "Removido" },
  };
  return configs[estado] || { label: estado };
};

const badgeStyle = (estado) =>
  ({
    rascunho: { background: "#f1f0ec", color: "#5f5e5a" },
    aguardando_intermediario: { background: "#faeeda", color: "#633806" },
    publicado: { background: "#eaf3de", color: "#27500a" },
    vendido: { background: "#e6f1fb", color: "#0c447c" },
    removido: { background: "#fcebeb", color: "#791f1f" },
  }[estado] || { background: "#f1f0ec", color: "#5f5e5a" });

const actionBtn = (variant) => ({
  fontSize: 11,
  fontWeight: 500,
  padding: "5px 12px",
  borderRadius: 6,
  cursor: "pointer",
  whiteSpace: "nowrap",
  border: "0.5px solid",
  ...(variant === "primary"
    ? { background: "#1e3a5f", color: "#fff", borderColor: "#1e3a5f" }
    : variant === "danger"
    ? { background: "transparent", color: "#a32d2d", borderColor: "#f7c1c1" }
    : {
        background: "transparent",
        color: "#374151",
        borderColor: "#e2e8f0",
      }),
});

const getCategoriaNome = (categoriaId) => {
  const categorias = {
    1: "Eletrônicos",
    2: "Moda",
    3: "Casa & Decoração",
    4: "Esportes",
    5: "Livros",
    6: "Automotivo",
    7: "Outros",
  };
  return categorias[categoriaId] || "Sem categoria";
};

const categoriasList = [
  { id: 1, nome: "Eletrônicos" },
  { id: 2, nome: "Moda" },
  { id: 3, nome: "Casa & Decoração" },
  { id: 4, nome: "Esportes" },
  { id: 5, nome: "Livros" },
  { id: 6, nome: "Automotivo" },
  { id: 7, nome: "Outros" },
];

const provinciasMocambique = [
  "Maputo Cidade",
  "Maputo Província",
  "Gaza",
  "Inhambane",
  "Manica",
  "Sofala",
  "Tete",
  "Zambézia",
  "Nampula",
  "Cabo Delgado",
  "Niassa"
];

const ProductCard = ({ product, onEdit, onStatusChange, onDelete }) => {
  if (!product) return null;

  const estadoConfig = getEstadoConfig(product.estado);
  const categoriaNome = getCategoriaNome(product.categoria_id);
  const localizacao = product.provincia || "Sem localização";
  const preco = `MZN ${Number(product.preco_minimo || 0).toLocaleString()}`;

  return (
    <div
      style={{
        width: 260,
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5eaf0",
        overflow: "hidden",
        transition: "all 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(30,58,95,0.08)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ width: "100%", height: 150, background: "#f1f5f9" }}>
        <img
          src={
            product.foto_url ||
            "https://placehold.co/300x150/1e3a5f/ffffff?text=Produto"
          }
          alt={product.nome}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div style={{ padding: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#1e3a5f", letterSpacing: "0.5px" }}>
          {categoriaNome.toUpperCase()}
        </span>

        <h3 style={{ fontSize: 14, fontWeight: 600, margin: "6px 0", color: "#0f172a" }}>
          {product.nome}
        </h3>

        <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
          {preco}
        </p>

        <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600, ...badgeStyle(product.estado) }}>
          {estadoConfig.label}
        </span>

        <div style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>
          {localizacao}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
          <button onClick={() => onEdit(product)} style={actionBtn("primary")}>
            Editar
          </button>

          {product.estado === "publicado" && (
            <button onClick={() => onStatusChange(product.id, "rascunho")} style={actionBtn()}>
              Rascunho
            </button>
          )}

          {product.estado === "rascunho" && (
            <button onClick={() => onStatusChange(product.id, "publicado")} style={actionBtn()}>
              Publicar
            </button>
          )}

          <button onClick={() => onDelete(product.id, product.nome)} style={actionBtn("danger")}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DashboardVendedor() {
  const [activePage, setActivePage] = useState("Dashboard");
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState({
    nome: "",
    email: "",
    tipo_usuario: "",
    id: null,
  });
  const [produtos, setProdutos] = useState([]);
  const [stats, setStats] = useState({
    total_produtos: 0,
    produtos_publicados: 0,
    aguardando_intermediario: 0,
    rascunhos: 0,
    vendidos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [comissaoPercentual, setComissaoPercentual] = useState(5);
  const [syncKey, setSyncKey] = useState(0);
  const loadingRef = useRef(false);
  const lastSyncRef = useRef(0);

  const [intermediarios, setIntermediarios] = useState([]); 
  const [loadingIntermediarios, setLoadingIntermediarios] = useState(false);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleLogout = () => {
    // Limpar tudo antes de sair
    localStorage.removeItem('blink_user');
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('blink_sync_flag');
    
    // Notificar outras abas sobre logout
    const syncData = {
      type: 'LOGOUT',
      timestamp: Date.now(),
      userId: usuarioLogado.id
    };
    localStorage.setItem('blink_sync_flag', JSON.stringify(syncData));
    localStorage.removeItem('blink_sync_flag'); // Remove imediatamente para limpar
    
    navigate('/auth');
  };

  // Função para carregar dados do usuário
  const loadUserData = useCallback(() => {
    const usuarioData = localStorage.getItem("blink_user");
    if (usuarioData) {
      try {
        const usuario = JSON.parse(usuarioData);
        setUsuarioLogado(prev => {
          if (prev.id !== usuario.id) {
            return {
              nome: usuario.nome || "Usuario",
              email: usuario.email || "",
              tipo_usuario: usuario.tipo_usuario || "",
              id: usuario.id,
            };
          }
          return prev;
        });
        return usuario.id;
      } catch (e) {
        console.error("Erro ao parsear usuário:", e);
      }
    }
    return null;
  }, []);

  // Função para carregar produtos com consistência
  const fetchProdutos = useCallback(async (force = false) => {
    if (loadingRef.current && !force) {
      console.log("Já está carregando, ignorando...");
      return;
    }
    
    loadingRef.current = true;
    
    try {
      setError(null);
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("blink_user") ? JSON.parse(localStorage.getItem("blink_user")).id : null;
      
      if (!token || !userId) {
        console.log("Sem token ou usuário");
        setProdutos([]);
        return;
      }
      
      console.log(`FetchProdutos - Buscando produtos para usuário ${userId}`);
      const data = await productsAPI.getMyProducts(token);
      
      let produtosArray = [];
      if (data && !data.error) {
        if (Array.isArray(data)) {
          produtosArray = data;
        } 
        else if (data.products && Array.isArray(data.products)) {
          produtosArray = data.products;
        }
        else if (data.produtos && Array.isArray(data.produtos)) {
          produtosArray = data.produtos;
        }
        else if (data.data && Array.isArray(data.data)) {
          produtosArray = data.data;
        }
        
        // Verificar se os produtos pertencem ao usuário atual
        produtosArray = produtosArray.filter(p => p.user_id === userId || p.vendedor_id === userId);
        
        console.log(`Produtos encontrados: ${produtosArray.length}`);
        setProdutos(produtosArray);
        
        // Salvar no sessionStorage (mais seguro que localStorage para múltiplas abas)
        sessionStorage.setItem(`produtos_${userId}`, JSON.stringify({
          produtos: produtosArray,
          timestamp: Date.now()
        }));
      } else {
        console.warn("Erro ou sem dados:", data);
        // Tentar recuperar do sessionStorage
        const cached = sessionStorage.getItem(`produtos_${userId}`);
        if (cached) {
          const { produtos: cachedProdutos, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 60000) { // 1 minuto de cache
            console.log("Usando cache do sessionStorage");
            setProdutos(cachedProdutos);
          }
        } else {
          setProdutos([]);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setError(error.message);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  // Função para carregar estatísticas
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("blink_user") ? JSON.parse(localStorage.getItem("blink_user")).id : null;
      
      if (!token || !userId) {
        setStats({
          total_produtos: 0,
          produtos_publicados: 0,
          aguardando_intermediario: 0,
          rascunhos: 0,
          vendidos: 0,
        });
        return;
      }
      
      console.log(`FetchStats - Buscando stats para usuário ${userId}`);
      const data = await productsAPI.getStats(token);
      
      if (data && !data.error) {
        const newStats = {
          total_produtos: data.total_produtos || data.total || 0,
          produtos_publicados: data.produtos_publicados || data.publicados || 0,
          aguardando_intermediario: data.aguardando_intermediario || data.aguardando || 0,
          rascunhos: data.rascunhos || data.drafts || 0,
          vendidos: data.vendidos || data.sold || 0,
        };
        
        setStats(newStats);
        
        // Salvar no sessionStorage
        sessionStorage.setItem(`stats_${userId}`, JSON.stringify({
          stats: newStats,
          timestamp: Date.now()
        }));
      } else {
        // Tentar recuperar do sessionStorage
        const cached = sessionStorage.getItem(`stats_${userId}`);
        if (cached) {
          const { stats: cachedStats, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 60000) {
            setStats(cachedStats);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }, []);

  // Função principal para carregar todos os dados
  const loadAllData = useCallback(async (force = false) => {
    if (force) {
      console.log("Force refresh - limpando caches");
      const userId = usuarioLogado.id;
      sessionStorage.removeItem(`produtos_${userId}`);
      sessionStorage.removeItem(`stats_${userId}`);
    }
    
    setLoading(true);
    await fetchProdutos(force);
    await fetchStats();
    setLoading(false);
    setSyncKey(prev => prev + 1);
  }, [fetchProdutos, fetchStats, usuarioLogado.id]);

  // Sincronização entre abas usando BroadcastChannel (moderno) ou localStorage (fallback)
  useEffect(() => {
    let channel;
    
    // Tentar usar BroadcastChannel (mais moderno e eficiente)
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel('blink_sync');
        channel.onmessage = (event) => {
          console.log("BroadcastChannel message received:", event.data);
          if (event.data.type === 'DATA_CHANGED') {
            console.log("Dados alterados em outra aba, sincronizando...");
            loadAllData(true);
          } else if (event.data.type === 'LOGOUT') {
            console.log("Logout detectado em outra aba");
            if (event.data.userId === usuarioLogado.id) {
              navigate('/auth');
            }
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel não suportado, usando fallback");
      }
    }
    
    // Fallback: usar storage event para sincronização
    const handleStorageChange = (e) => {
      if (e.key === 'blink_sync_flag' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          console.log("Storage event received:", data);
          if (data.type === 'DATA_CHANGED') {
            loadAllData(true);
          } else if (data.type === 'LOGOUT' && data.userId === usuarioLogado.id) {
            navigate('/auth');
          }
        } catch (err) {
          console.error("Erro ao processar storage event:", err);
        }
        // Limpar flag
        setTimeout(() => localStorage.removeItem('blink_sync_flag'), 100);
      }
      
      // Verificar se o usuário mudou
      if (e.key === 'blink_user') {
        console.log("Usuário alterado, recarregando...");
        loadUserData();
        loadAllData(true);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      if (channel) {
        channel.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadAllData, loadUserData, navigate, usuarioLogado.id]);

  // Carregamento inicial
  useEffect(() => {
    loadUserData();
    loadAllData();
    
    // Visibility API: quando a aba ficar visível novamente, sincronizar
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Aba ficou visível, sincronizando...");
        loadAllData(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadAllData, loadUserData]);

  // Notificar outras abas sobre mudanças
  const notifyOtherTabs = useCallback((type, data = {}) => {
    const syncData = {
      type,
      timestamp: Date.now(),
      userId: usuarioLogado.id,
      ...data
    };
    
    // Usar BroadcastChannel se disponível
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('blink_sync');
        channel.postMessage(syncData);
        setTimeout(() => channel.close(), 100);
      } catch (e) {
        // Fallback para localStorage
        localStorage.setItem('blink_sync_flag', JSON.stringify(syncData));
      }
    } else {
      // Fallback para localStorage
      localStorage.setItem('blink_sync_flag', JSON.stringify(syncData));
    }
  }, [usuarioLogado.id]);

  // Carregar intermediários quando a aba for selecionada
  useEffect(() => {
    if (activePage === "Intermediarios") {
      fetchIntermediarios();
    }
  }, [activePage]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData(true);
    setRefreshing(false);
    notifyOtherTabs('DATA_CHANGED', { action: 'refresh' });
    showNotification(`${produtos.length} produtos encontrados!`, "success");
  };


    // Buscar lista de intermediários disponíveis
  const fetchIntermediarios = async () => {
    setLoadingIntermediarios(true);
    try {
      // Essa rota já existe no seu backend e não precisa de token!
      const response = await fetch('https://blink-oz62.onrender.com/api/intermediario/listar');
      
      if (!response.ok) throw new Error("Erro ao buscar");
      
      const data = await response.json();
      setIntermediarios(data);
    } catch (error) {
      console.error("Erro ao buscar intermediários:", error);
    } finally {
      setLoadingIntermediarios(false);
    }
  };

  const handleStatusChange = async (produtoId, novoEstado) => {
    try {
      const token = localStorage.getItem("accessToken");
      const data = await productsAPI.updateStatus(token, produtoId, novoEstado);
      if (data.error) {
        showNotification(data.message || "Erro ao atualizar status", "error");
      } else {
        await loadAllData(true);
        notifyOtherTabs('DATA_CHANGED', { action: 'status_change', produtoId, novoEstado });
        showNotification(
          novoEstado === "publicado" ? "Produto publicado com sucesso!" : "Produto guardado como rascunho",
          "success"
        );
      }
    } catch {
      showNotification("Erro ao atualizar status do produto", "error");
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      const data = await productsAPI.deleteProduct(token, productToDelete.id);
      if (data.error) {
        showNotification(data.message || "Erro ao remover produto", "error");
      } else {
        await loadAllData(true);
        notifyOtherTabs('DATA_CHANGED', { action: 'delete', produtoId: productToDelete.id });
        showNotification(`"${productToDelete.nome}" foi removido com sucesso!`, "success");
      }
    } catch {
      showNotification("Erro ao remover produto", "error");
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    if (!editingProduct.nome?.trim()) {
      showNotification("O nome do produto é obrigatório", "error");
      return;
    }
    if (!editingProduct.preco_minimo || editingProduct.preco_minimo <= 0) {
      showNotification("O preço deve ser maior que zero", "error");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showNotification("Token de autenticação não encontrado", "error");
        return;
      }
      const productData = {
        nome: editingProduct.nome,
        descricao: editingProduct.descricao || "",
        preco_minimo: parseFloat(editingProduct.preco_minimo),
        comissao_intermediario: parseFloat(editingProduct.comissao_intermediario || 0),
        categoria_id: editingProduct.categoria_id || null,
        provincia: editingProduct.provincia || "",
      };
      const data = await productsAPI.updateProduct(token, editingProduct.id, productData);
      if (data.error) {
        showNotification(data.message || "Erro ao atualizar produto", "error");
      } else {
        await loadAllData(true);
        notifyOtherTabs('DATA_CHANGED', { action: 'update', produtoId: editingProduct.id });
        setShowEditModal(false);
        setEditingProduct(null);
        showNotification("Produto atualizado com sucesso!", "success");
      }
    } catch {
      showNotification("Erro ao atualizar produto", "error");
    }
  };

  const handleProductAdded = () => {
    loadAllData(true);
    notifyOtherTabs('DATA_CHANGED', { action: 'add_product' });
    setActivePage("Meus Produtos");
    showNotification("Produto adicionado com sucesso!", "success");
  };

  const openDeleteConfirm = (produtoId, produtoNome) => {
    setProductToDelete({ id: produtoId, nome: produtoNome });
    setShowDeleteConfirm(true);
  };

  const handleEditProduct = (produto) => {
    let percentual = 5;
    if (produto.preco_minimo > 0 && produto.comissao_intermediario > 0) {
      percentual = (produto.comissao_intermediario / produto.preco_minimo) * 100;
      percentual = Math.min(100, Math.max(1, percentual));
    }
    setComissaoPercentual(Math.round(percentual * 10) / 10);
    setEditingProduct({ ...produto });
    setShowEditModal(true);
  };

  const handlePrecoChange = (novoPreco) => {
    const preco = parseFloat(novoPreco) || 0;
    setEditingProduct({
      ...editingProduct,
      preco_minimo: preco,
      comissao_intermediario: (preco * comissaoPercentual) / 100,
    });
  };

  const handleComissaoPercentualChange = (percentual) => {
    let p = Math.min(100, Math.max(1, parseFloat(percentual) || 0));
    setComissaoPercentual(p);
    setEditingProduct({
      ...editingProduct,
      comissao_intermediario: ((editingProduct?.preco_minimo || 0) * p) / 100,
    });
  };

  const getInicial = (nome) => (nome ? nome.charAt(0).toUpperCase() : "?");

  const getPapelUsuario = (tipo) =>
    ({ vendedor: "Vendedor", intermediario: "Intermediário", cliente: "Cliente" }[tipo] || "Usuário");

  const statsCards = [
    { icon: <IconTotalProdutos />, label: "Total de produtos", value: stats.total_produtos },
    { icon: <IconPublicados />, label: "Publicados", value: stats.produtos_publicados },
    { icon: <IconAguardando />, label: "Aguardando", value: stats.aguardando_intermediario },
    { icon: <IconVendidos />, label: "Vendidos", value: stats.vendidos },
  ];

  const reloadBtn = (
    <button
      onClick={handleRefresh}
      disabled={refreshing}
      style={{
        padding: "6px 14px",
        background: "#1e3a5f",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: refreshing ? "not-allowed" : "pointer",
        opacity: refreshing ? 0.6 : 1,
        fontSize: 12,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <IconRecarregar />
      {refreshing ? "A recarregar..." : "Recarregar"}
    </button>
  );

  if (loading && produtos.length === 0) {
    return (
      <div className="dv-root">
        <div style={{ textAlign: "center", padding: 50 }}>Carregando...</div>
      </div>
    );
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
          <span className="dv-search-icon"><IconPesquisa /></span>
          <input
            className="dv-search"
            type="text"
            placeholder="Pesquisar produtos ou pedidos..."
          />
        </div>
        <div className="dv-nav-icons">
          <button className="dv-icon-btn" onClick={() => navigate("/vendedor/solicitacoes")}>
            <IconNotificacao />
          </button>
          <button className="dv-icon-btn">
            <IconMensagem />
          </button>
          <div className="dv-avatar">
            {getInicial(usuarioLogado.nome)} <span>▾</span>
          </div>
        </div>
      </nav>

      <div className="dv-body">
        <aside className="dv-sidebar">
          <nav className="dv-menu">
            {menuItemsConfig.map((item) => (
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
            <div className="dv-profile-avatar">
              {getInicial(usuarioLogado.nome)}
            </div>
            <div className="dv-profile-info">
              <p className="dv-profile-name">{usuarioLogado.nome}</p>
              <p className="dv-profile-role">
                {getPapelUsuario(usuarioLogado.tipo_usuario)}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="dv-btn-sair">
            Sair
          </button>
        </aside>

        <main className="dv-main">
          {error && (
            <div
              style={{
                background: "#fcebeb",
                color: "#791f1f",
                padding: "10px 14px",
                marginBottom: 20,
                borderRadius: 8,
                fontSize: 13,
                border: "0.5px solid #f7c1c1",
              }}
            >
              {error}
              <button 
                onClick={handleRefresh}
                style={{ marginLeft: 10, padding: "4px 8px", cursor: "pointer" }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {activePage === "Dashboard" && (
            <>
              <div className="dv-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h1 className="dv-welcome">
                      Bem-vindo, {usuarioLogado.nome.split(" ")[0]}
                    </h1>
                    <p className="dv-welcome-sub">
                      Aqui está o resumo do seu marketplace hoje.
                    </p>
                  </div>
                  {reloadBtn}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "row", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
                {statsCards.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      flex: "1 1 auto",
                      minWidth: 180,
                      background: "#fff",
                      borderRadius: 16,
                      border: "1px solid #e5eaf0",
                      padding: "20px 16px",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <div style={{ marginBottom: 12 }}>{s.icon}</div>
                    <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{s.label}</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="dv-section-header" style={{ marginTop: 8 }}>
                <h2 className="dv-section-title">Meus Produtos</h2>
                <button className="dv-ver-todos" onClick={() => setActivePage("Meus Produtos")}>
                  Ver todos ({produtos.length})
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                {produtos.slice(0, 4).map((produto) => (
                  <ProductCard
                    key={produto.id}
                    product={produto}
                    onEdit={handleEditProduct}
                    onStatusChange={handleStatusChange}
                    onDelete={openDeleteConfirm}
                  />
                ))}
              </div>

              {produtos.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#718096", background: "#f9f9f7", borderRadius: 10, border: "0.5px solid #e2e8f0" }}>
                  <p style={{ marginBottom: 12 }}>
                    {stats.total_produtos > 0 
                      ? `Há ${stats.total_produtos} produto(s) no sistema, mas não foi possível carregar a lista. Clique em "Recarregar" para tentar novamente.`
                      : "Ainda não tem produtos cadastrados."}
                  </p>
                  <button onClick={() => setActivePage("Adicionar produto")} style={actionBtn("primary")}>
                    Adicionar Produto
                  </button>
                </div>
              )}
            </>
          )}

          {activePage === "Vendas" && <Vendas />}

          {activePage === "Meus Produtos" && (
            <div>
              <div className="dv-section-header" style={{ marginBottom: 16 }}>
                <h2 className="dv-section-title">Todos os Meus Produtos ({produtos.length})</h2>
                {reloadBtn}
              </div>
              <div style={{ display: "flex", flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                {produtos.map((produto) => (
                  <ProductCard
                    key={produto.id}
                    product={produto}
                    onEdit={handleEditProduct}
                    onStatusChange={handleStatusChange}
                    onDelete={openDeleteConfirm}
                  />
                ))}
              </div>
              {produtos.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#718096", background: "#f9f9f7", borderRadius: 10, border: "0.5px solid #e2e8f0" }}>
                  Nenhum produto encontrado.
                  {stats.total_produtos > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <small>Mas as estatísticas indicam {stats.total_produtos} produto(s). Clique em "Recarregar" para tentar novamente.</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

                    {activePage === "Intermediarios" && (
            <div>
              <div className="dv-section-header" style={{ marginBottom: 20 }}>
                <div>
                  <h2 className="dv-section-title">Intermediários Disponíveis</h2>
                  <p style={{ color: "#64748b", fontSize: 13 }}>Profissionais prontos para vender seus produtos.</p>
                </div>
                <button onClick={fetchIntermediarios} disabled={loadingIntermediarios} style={{ padding: "6px 14px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                  {loadingIntermediarios ? "Buscando..." : "⟳ Atualizar"}
                </button>
              </div>

              {loadingIntermediarios ? (
                <p style={{ textAlign: "center", color: "#64748b" }}>Carregando lista...</p>
              ) : intermediarios.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, background: "#f9f9f7", borderRadius: 10 }}>
                  <p style={{ color: "#718096" }}>Nenhum intermediário cadastrado no sistema ainda.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {intermediarios.map((inter) => (
                    <div key={inter.id} style={{ background: "#fff", border: "1px solid #e5eaf0", borderRadius: 12, padding: "20px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e2e8f0", color: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 20 }}>
                        {inter.nome ? inter.nome.charAt(0).toUpperCase() : "I"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 4px 0", fontSize: 16, color: "#0f172a" }}>{inter.nome}</h3>
                        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{inter.email}</p>
                        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
                          <span>⭐ {inter.avaliacao || "N/A"}</span>
                          <span>📍 Moçambique</span>
                        </div>
                      </div>
                      <span style={{ padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#eaf3de", color: "#27500a" }}>ATIVO</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activePage === "Adicionar produto" && (
            <CadastroProduto onProductAdded={handleProductAdded} />
          )}
        </main>
      </div>

      {showEditModal && editingProduct && (
        <div className="dv-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="dv-modal-container-edit" onClick={(e) => e.stopPropagation()}>
            <div className="dv-modal-header">
              <h3>Editar Produto</h3>
              <button className="dv-modal-close" onClick={() => setShowEditModal(false)}>
                <IconClose />
              </button>
            </div>
            <div className="dv-modal-body">
              <div className="dv-form-group">
                <label className="dv-label">Nome do produto *</label>
                <input
                  type="text"
                  className="dv-input"
                  value={editingProduct.nome || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nome: e.target.value })}
                  placeholder="Ex: Smartwatch Series X"
                />
              </div>

              <div className="dv-form-group">
                <label className="dv-label">Categoria *</label>
                <select
                  className="dv-select"
                  value={editingProduct.categoria_id || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoria_id: parseInt(e.target.value) })}
                >
                  <option value="">Selecione uma categoria</option>
                  {categoriasList.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>

              <div className="dv-form-group">
                <label className="dv-label">Província *</label>
                <select
                  className="dv-select"
                  value={editingProduct.provincia || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, provincia: e.target.value })}
                >
                  <option value="">Selecione uma província</option>
                  {provinciasMocambique.map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              <div className="dv-form-group">
                <label className="dv-label">Descrição</label>
                <textarea
                  className="dv-textarea"
                  rows="4"
                  value={editingProduct.descricao || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descricao: e.target.value })}
                  placeholder="Descreva seu produto detalhadamente..."
                />
              </div>

              <div className="dv-row-2col">
                <div className="dv-form-group">
                  <label className="dv-label">Preço (MZN) *</label>
                  <input
                    type="number"
                    className="dv-input"
                    step="0.01"
                    value={editingProduct.preco_minimo || ""}
                    onChange={(e) => handlePrecoChange(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="dv-form-group">
                  <label className="dv-label">Comissão (%)</label>
                  <input
                    type="number"
                    className="dv-input"
                    step="0.5"
                    min="1"
                    max="100"
                    value={comissaoPercentual}
                    onChange={(e) => handleComissaoPercentualChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="dv-form-group">
                <label className="dv-label">Valor da comissão (MZN)</label>
                <input
                  type="text"
                  className="dv-input"
                  value={editingProduct.comissao_intermediario?.toFixed(2) || "0.00"}
                  disabled
                  style={{ background: "#f5f5f5", color: "#718096" }}
                />
                <small className="dv-hint">Valor calculado automaticamente com base no preço e comissão</small>
              </div>
            </div>
            <div className="dv-modal-footer">
              <button className="dv-btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
              <button className="dv-btn-save" onClick={handleUpdateProduct}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && productToDelete && (
        <div className="dv-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="dv-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="dv-modal-confirm-icon">
              <IconAlertTriangle />
            </div>
            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja remover o produto <strong>"{productToDelete.nome}"</strong>?
              <br />
              <span style={{ fontSize: 12, color: "#e53e3e" }}>Esta ação não pode ser desfeita.</span>
            </p>
            <div className="dv-modal-confirm-buttons">
              <button className="dv-btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </button>
              <button className="dv-btn-danger" onClick={confirmDelete}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}