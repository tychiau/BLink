import { useState } from "react";
import "./DashboardVendedor.css";
import Vendas from "./Vendas";

const stats = [
  { icon: "🗂️", label: "TOTAL DE PRODUTOS", value: "142", change: "+12%", up: true },
  { icon: "🤝", label: "INTERMEDIÁRIOS ATIVOS", value: "28", change: "+5%", up: true },
  { icon: "💬", label: "PRODUTOS EM NEGOCIAÇÃO", value: "14", change: "Estável", up: null },
  { icon: "💰", label: "RECEITA ESTIMADA", value: "MZM 12.450", change: "+18%", up: true },
];

const produtos = [
  { id: 1, nome: "Smartwatch Series X", categoria: "ELECTRÓNICOS", preco: "MZM 899", status: "ATIVO", intermediarios: 8, img: "https://placehold.co/300x200/2d3748/ffffff?text=Smartwatch" },
  { id: 2, nome: "Fone Bluetooth Pro", categoria: "ACESSÓRIOS", preco: "MZM 450", status: "PAUSADO", intermediarios: 3, img: "https://placehold.co/300x200/2d3748/ffffff?text=Fone+Bluetooth" },
];

const menuItems = [
  { label: "Dashboard", icon: "⊞" },
  { label: "Vendas", icon: "🛒" },
  { label: "Meus Produtos", icon: "📋" },
  { label: "Intermediários", icon: "👥" },
  { label: "Adicionar produto", icon: "➕" },
];

export default function DashboardVendedor() {
  const [activePage, setActivePage] = useState("Dashboard");

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
          <div className="dv-avatar">M <span>▾</span></div>
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
            <div className="dv-profile-avatar">M</div>
            <div className="dv-profile-info">
              <p className="dv-profile-name">Marcos Oliveira</p>
              <p className="dv-profile-role">Vendedor</p>
            </div>
          </div>
        </aside>

        <main className="dv-main">

          {activePage === "Dashboard" && (
            <>
              <div className="dv-header">
                <h1 className="dv-welcome">Bem-vindo de volta, Marcos</h1>
                <p className="dv-welcome-sub">Aqui está o resumo do seu marketplace hoje.</p>
              </div>
              <div className="dv-stats-grid">
                {stats.map((s) => (
                  <div className="dv-stat-card" key={s.label}>
                    <div className="dv-stat-top">
                      <div className="dv-stat-icon-box">{s.icon}</div>
                      <span className={`dv-stat-change ${s.up === true ? "dv-stat-change--up" : s.up === false ? "dv-stat-change--down" : "dv-stat-change--stable"}`}>
                        {s.change} {s.up === true ? "↗" : s.up === false ? "↘" : ""}
                      </span>
                    </div>
                    <p className="dv-stat-label">{s.label}</p>
                    <p className="dv-stat-value">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="dv-section-header">
                <h2 className="dv-section-title">Produtos Recentes</h2>
                <button className="dv-ver-todos" onClick={() => setActivePage("Meus Produtos")}>Ver todos</button>
              </div>
              <div className="dv-produtos-grid">
                {produtos.map((p) => (
                  <div className="dv-produto-card" key={p.id}>
                    <div className="dv-produto-img-wrapper">
                      <img src={p.img} alt={p.nome} className="dv-produto-img" />
                      <span className={`dv-produto-badge ${p.status === "ATIVO" ? "dv-badge--ativo" : "dv-badge--pausado"}`}>{p.status}</span>
                    </div>
                    <div className="dv-produto-info">
                      <span className="dv-produto-categoria">{p.categoria}</span>
                      <div className="dv-produto-nome-preco">
                        <p className="dv-produto-nome">{p.nome}</p>
                        <p className="dv-produto-preco">{p.preco}</p>
                      </div>
                      <p className="dv-produto-intermediarios">👥 {p.intermediarios} intermediários interessados</p>
                      <div className="dv-produto-acoes">
                        <button className="dv-acao-btn" title="Editar">✏️</button>
                        <button className="dv-acao-btn" title={p.status === "ATIVO" ? "Pausar" : "Activar"}>{p.status === "ATIVO" ? "⏸️" : "▶️"}</button>
                        <button className="dv-acao-btn" title="Eliminar">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activePage === "Vendas" && <Vendas />}

          {activePage === "Meus Produtos" && (
            <div className="dv-em-breve">
              <span>📋</span>
              <h2>Meus Produtos</h2>
              <p>Em construção...</p>
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
            <div className="dv-em-breve">
              <span>➕</span>
              <h2>Adicionar Produto</h2>
              <p>Em construção...</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}