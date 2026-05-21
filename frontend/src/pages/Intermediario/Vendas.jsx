import { useState, useEffect } from 'react';
import { intermediarioAPI } from '../../api';  // ← Corrigido

const Vendas = ({ token, onShowNotification }) => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVendas: 0,
    totalGanho: 0,
    pendentes: 0,
    liquidados: 0
  });

  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchVendas = async () => {
    try {
      // Tentar buscar vendas ativas e histórico
      const [vendasAtivas, historico] = await Promise.all([
        intermediarioAPI.getVendasAtivas?.(token) || Promise.resolve([]),
        intermediarioAPI.getHistoricoGanhos?.(token) || Promise.resolve([])
      ]);

      let todasVendas = [];
      
      if (vendasAtivas && !vendasAtivas.error && Array.isArray(vendasAtivas)) {
        todasVendas.push(...vendasAtivas.map(v => ({ ...v, tipo: 'ativa' })));
      }
      
      if (historico && !historico.error && Array.isArray(historico)) {
        todasVendas.push(...historico.map(v => ({ ...v, tipo: 'historico' })));
      }

      setVendas(todasVendas);
      
      const totalVendas = todasVendas.length;
      const totalGanho = todasVendas.reduce((acc, v) => acc + (v.ganho || v.ganho_estimado || 0), 0);
      const pendentes = todasVendas.filter(v => v.status_venda === 'retido' || v.status === 'pendente').length;
      const liquidados = todasVendas.filter(v => v.status_venda === 'liquidado' || v.status === 'liquidado').length;
      
      setStats({ totalVendas, totalGanho, pendentes, liquidados });
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      setVendas([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'liquidado':
      case 'liquidada':
        return <span className="status-badge status-liquidado">✓ Liquidado</span>;
      case 'retido':
      case 'pendente':
        return <span className="status-badge status-pendente">⏳ Pendente</span>;
      case 'estornado':
        return <span className="status-badge status-estornado">↺ Estornado</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="di-loading">
        <div className="spinner"></div>
        <p>Carregando vendas...</p>
      </div>
    );
  }

  return (
    <div className="vendas-container">
      {/* Estatísticas */}
      <div className="di-stats-grid" style={{ marginBottom: 24 }}>
        <div className="di-stat-card">
          <div className="di-stat-top">
            <div className="di-stat-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <p className="di-stat-label">Total de Vendas</p>
          <p className="di-stat-value">{stats.totalVendas}</p>
        </div>

        <div className="di-stat-card">
          <div className="di-stat-top">
            <div className="di-stat-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <p className="di-stat-label">Ganho Total</p>
          <p className="di-stat-value highlight">MZN {stats.totalGanho.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="di-stat-card">
          <div className="di-stat-top">
            <div className="di-stat-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <p className="di-stat-label">Pendentes</p>
          <p className="di-stat-value">{stats.pendentes}</p>
        </div>

        <div className="di-stat-card">
          <div className="di-stat-top">
            <div className="di-stat-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
          <p className="di-stat-label">Liquidados</p>
          <p className="di-stat-value">{stats.liquidados}</p>
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="di-section-header">
        <h2 className="di-section-title">Histórico de Vendas</h2>
      </div>

      {vendas.length === 0 ? (
        <div className="di-empty-state">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p>Nenhuma venda registrada</p>
          <small>Quando houver vendas dos seus produtos, elas aparecerão aqui.</small>
        </div>
      ) : (
        <div className="vendas-table">
          <table className="di-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Sua Comissão</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <tr key={venda.id}>
                  <td>
                    <div className="venda-produto">
                      <img 
                        src={venda.foto_url || "https://placehold.co/40x40/1e3a5f/ffffff?text=P"} 
                        alt={venda.produto_nome}
                        className="venda-produto-img"
                      />
                      <span>{venda.produto_nome}</span>
                    </div>
                  </td>
                  <td>{venda.cliente_nome || 'Cliente'}</td>
                  <td>MZN {venda.valor_final?.toLocaleString() || '—'}</td>
                  <td className="ganho-cell">
                    MZN {(venda.ganho || venda.ganho_estimado || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td>{getStatusBadge(venda.status_venda || venda.status)}</td>
                  <td>{new Date(venda.data_venda).toLocaleDateString('pt-MZ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .vendas-container {
          width: 100%;
        }
        .di-table {
          width: 100%;
          background: white;
          border-radius: 16px;
          border-collapse: collapse;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .di-table th {
          text-align: left;
          padding: 16px;
          background: #f8fafc;
          font-weight: 600;
          color: #1e3a5f;
          border-bottom: 1px solid #e2e8f0;
        }
        .di-table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
        }
        .di-table tr:hover {
          background: #f8fafc;
        }
        .venda-produto {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .venda-produto-img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }
        .ganho-cell {
          font-weight: 600;
          color: #10b981;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .status-liquidado {
          background: #d1fae5;
          color: #065f46;
        }
        .status-pendente {
          background: #fed7aa;
          color: #92400e;
        }
        .status-estornado {
          background: #fee2e2;
          color: #991b1b;
        }
        .di-stat-value.highlight {
          color: #10b981;
          font-size: 1.75rem;
        }
        @media (max-width: 768px) {
          .di-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Vendas;