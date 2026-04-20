import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import "./DashboardIntermediario.css";

const STATS_CONFIG = [
  { key: "produtosAtivos", badge: "+12%", badgeType: "green", label: "PRODUTOS ATIVOS" },
  { key: "vendasRealizadas", badge: "+5%", badgeType: "green", label: "VENDAS REALIZADAS" },
  { key: "comissaoMes", badge: "2.4k MZM", badgeType: "blue", label: "COMISSÃO DO MÊS", highlight: true },
  { key: "taxaConversao", badge: "High", badgeType: "orange", label: "TAXA DE CONVERSÃO" },
];
//oi
const STAT_ICONS = {
  produtosAtivos: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  vendasRealizadas: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  comissaoMes: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  taxaConversao: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
};

const STATS_VAZIOS = {
  produtosAtivos: "0",
  vendasRealizadas: "0",
  comissaoMes: "0 MZM",
  taxaConversao: "0%",
};

export default function DashboardIntermediario() {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate()
  const [stats, setStats] = useState(STATS_VAZIOS);
  const [aprovacoes, setAprovacoes] = useState([]);
  const [meusProdutosAtivos, setMeusProdutosAtivos] = useState([]);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    const verificarBD = async () => {
      // Muda para true e preenche os dados quando a BD estiver pronta
      const bdEstaConectada = false;

      if (bdEstaConectada) {
        setDbConnected(true);

        // Substitui pelos dados reais da BD
        setStats({
          produtosAtivos: "42",
          vendasRealizadas: "18",
          comissaoMes: "4.850 MZM",
          taxaConversao: "94.2%",
        });

        setProdutos([
          // Aqui vêm os produtos da BD
        ]);

        setAprovacoes([
          // Aqui vêm as aprovações pendentes da BD
          // Exemplo:
          // {
          //   img: "url_da_imagem",
          //   name: "Nome do Produto",
          //   seller: "Vendedor: Nome",
          //   status: "PENDENTE",
          //   statusType: "pending",
          //   date: "12/05/2028",
          // },
        ]);

        setMeusProdutosAtivos([
          // Aqui vêm os meus produtos ativos da BD
          // Exemplo:
          // {
          //   img: "url_da_imagem",
          //   name: "Nome do Produto",
          //   views: "1.2k",
          //   price: "4.500 MZM",
          //   commission: "10%",
          // },
        ]);
      } else {
        setDbConnected(false);
        setStats(STATS_VAZIOS);
        setProdutos([]);
        setAprovacoes([]);
        setMeusProdutosAtivos([]);
      }
    };

    verificarBD();
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
            <div className="header-user">
              <div className="header-user-info">
                <div className="header-user-name"> Intermediário</div>
                <div className="header-user-id">ID 48502</div>
              </div>
              <div className="avatar">MI</div>
            </div>
            <button className="icon-btn" onClick={() => navigate('/intermediario/solicitacoes')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className="icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD WRAPPER - Sidebar fixa à esquerda e Main separado */}
      <div className="dashboard-wrapper">
        {/* SIDEBAR - FIXA/ESTÁTICA DO LADO ESQUERDO */}
        <aside className="sidebar">
            <div className="sidebar-profile">
              <div className="sidebar-label" style={{ textAlign: 'left', width: '100%' }}>PAINEL INTERMEDIÁRIO</div>
              <div className="sidebar-name" style={{ textAlign: 'left', width: '100%' }}>Minha Conta</div>
              <nav className="sidebar-nav">
              {[
                {
                  label: "DASHBOARD", active: true,
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                },
                {
                  label: "NOVOS PRODUTOS",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                },
                {
                  label: "MEUS PRODUTOS",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                },
                {
                  label: "GANHOS",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
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
            <div className="support-label"style={{ textAlign: 'left', width: '100%' }}>SUPORTE DIRETO</div>
            <button className="btn-support">FALAR COM CONSULTOR</button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* STATS */}
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

          {/* OPORTUNIDADES */}
          <div>
            <div className="section-header">
              <div className="section-header-left">
                <div className="section-title">Oportunidades de Venda</div>
                <div className="section-sub">Stock local disponível para intermediação imediata.</div>
              </div>
              <button className="btn-filter">⚙ Filtros</button>
            </div>

            {!dbConnected || produtos.length === 0 ? (
              <div className="empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <p>Produtos indisponíveis</p>
                <small>Aguardando conexão com a base de dados...</small>
              </div>
            ) : (
              <div className="products-grid">
                {produtos.map((p) => (
                  <div className="product-card" key={p.name}>
                    <div className="product-img-wrap">
                      <img src={p.img} alt={p.name} loading="lazy" />
                      <span className="product-tag">{p.tag}</span>
                    </div>
                    <div className="product-body">
                      <div className="product-seller">{p.seller}</div>
                      <div className="product-name">{p.name}</div>
                      <div className="product-pricing">
                        <div className="price-col">
                          <label>VALOR SUGERIDO</label>
                          <span className="price">{p.price}</span>
                        </div>
                        <div className="price-col">
                          <label>COMISSÃO</label>
                          <span className="commission">{p.commission}</span>
                        </div>
                      </div>
                      <button className="btn-vincular">Vincular ao Meu Perfil</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTTOM */}
          <div className="bottom-grid">
            {/* APROVAÇÃO PENDENTE - DINÂMICO */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Aprovação Pendente</div>
                {aprovacoes.length > 0 && <a className="card-link">Ver todos</a>}
              </div>
              {!dbConnected || aprovacoes.length === 0 ? (
                <div className="empty-state-small">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 8v4l3 3M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"/>
                  </svg>
                  <p>Sem aprovações pendentes</p>
                </div>
              ) : (
                aprovacoes.map((a) => (
                  <div className="approval-item" key={a.name}>
                    <img className="approval-thumb" src={a.img} alt={a.name} />
                    <div className="approval-info">
                      <div className="approval-name">{a.name}</div>
                      <div className="approval-seller">{a.seller}</div>
                    </div>
                    <div className="approval-right">
                      <span className={`status-badge ${a.statusType}`}>{a.status}</span>
                      <div className="approval-date">{a.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* MEUS PRODUTOS ATIVOS - DINÂMICO */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Meus Produtos Ativos</div>
                {meusProdutosAtivos.length > 0 && <a className="card-link">Ver todos</a>}
              </div>
              {!dbConnected || meusProdutosAtivos.length === 0 ? (
                <div className="empty-state-small">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="13" r="3"/>
                  </svg>
                  <p>Nenhum produto ativo</p>
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

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner" style={{ textAlign: 'left' }}>
          <div className="footer-brand" style={{ textAlign: 'left' }}>
            <span className="logo" style={{ textAlign: 'left', display: 'block' }}>BLINK</span>
            <p style={{ textAlign: 'left', marginLeft: '20px', marginTop: '20px'}}>Conectando produtos de qualidade ao mercado local.</p>
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
            <p style={{ textAlign: 'left' }}>Maputo</p>
          </div>
        </div>
      </footer>
    </>
  );
  
}