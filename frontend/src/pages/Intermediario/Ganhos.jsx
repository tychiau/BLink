import { useState, useEffect } from 'react';
import { intermediarioAPI } from '../../api';  // ← Corrigido

const Ganhos = ({ token, onShowNotification }) => {
  const [ganhos, setGanhos] = useState({
    total: 0,
    mesAtual: 0,
    historico: [],
    porMes: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGanhos();
  }, []);

  const fetchGanhos = async () => {
    try {
      const [comissaoMensal, historico] = await Promise.all([
        intermediarioAPI.getComissaoMensal?.(token) || Promise.resolve({ comissao_total: 0 }),
        intermediarioAPI.getHistoricoGanhos?.(token) || Promise.resolve([])
      ]);

      let historicoGanhos = [];
      let ganhosPorMes = {};

      if (historico && !historico.error && Array.isArray(historico)) {
        historicoGanhos = historico;
        
        historico.forEach(ganho => {
          const key = `${ganho.mes}/${ganho.ano}`;
          if (!ganhosPorMes[key]) {
            ganhosPorMes[key] = { mes: ganho.mes, ano: ganho.ano, total: 0, vendas: 0 };
          }
          ganhosPorMes[key].total += ganho.ganho || 0;
          ganhosPorMes[key].vendas += 1;
        });
      }

      const total = historicoGanhos.reduce((acc, g) => acc + (g.ganho || 0), 0);
      const mesAtual = Number(comissaoMensal?.comissao_total || 0);

      setGanhos({
        total,
        mesAtual,
        historico: historicoGanhos,
        porMes: Object.values(ganhosPorMes).sort((a, b) => {
          if (a.ano !== b.ano) return b.ano - a.ano;
          return b.mes - a.mes;
        })
      });
    } catch (error) {
      console.error('Erro ao buscar ganhos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNomeMes = (mes) => {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return meses[mes - 1];
  };

  if (loading) {
    return (
      <div className="di-loading">
        <div className="spinner"></div>
        <p>Carregando ganhos...</p>
      </div>
    );
  }

  return (
    <div className="ganhos-container">
      {/* Cards Principais */}
      <div className="di-stats-grid" style={{ marginBottom: 24 }}>
        <div className="di-stat-card highlight-card">
          <div className="di-stat-top">
            <div className="di-stat-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
              </svg>
            </div>
          </div>
          <p className="di-stat-label">Ganho Total</p>
          <p className="di-stat-value highlight">MZN {ganhos.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="di-stat-card">
          <div className="di-stat-top">
            <div className="di-stat-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 4h8" />
              </svg>
            </div>
          </div>
          <p className="di-stat-label">Este Mês</p>
          <p className="di-stat-value">MZN {ganhos.mesAtual.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="di-stat-card">
          <div className="di-stat-top">
            <div className="di-stat-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
          <p className="di-stat-label">Total de Vendas</p>
          <p className="di-stat-value">{ganhos.historico.length}</p>
        </div>
      </div>

      {/* Gráfico de Ganhos por Mês */}
      <div className="di-card" style={{ marginBottom: 24 }}>
        <div className="di-card-header">
          <span className="di-card-title">Ganhos por Mês</span>
        </div>
        <div className="ganhos-grafico">
          {ganhos.porMes.length === 0 ? (
            <div className="di-empty-state" style={{ padding: '40px' }}>
              <p>Nenhum ganho registrado ainda</p>
            </div>
          ) : (
            <div className="grafico-barras">
              {ganhos.porMes.map((item) => (
                <div key={`${item.mes}-${item.ano}`} className="barra-item">
                  <div className="barra-info">
                    <span className="barra-mes">{getNomeMes(item.mes)}/{item.ano}</span>
                    <span className="barra-valor">MZN {item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="barra-container">
                    <div 
                      className="barra"
                      style={{ 
                        width: `${Math.min((item.total / ganhos.total) * 100, 100)}%`,
                        backgroundColor: '#1e3a5f'
                      }}
                    />
                  </div>
                  <div className="barra-detalhes">
                    <span>{item.vendas} venda{item.vendas !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Histórico Detalhado */}
      <div className="di-card">
        <div className="di-card-header">
          <span className="di-card-title">Histórico Detalhado</span>
        </div>
        {ganhos.historico.length === 0 ? (
          <div className="di-empty-state" style={{ padding: '40px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p>Nenhum histórico de ganhos</p>
          </div>
        ) : (
          <div className="historico-lista">
            {ganhos.historico.map((item, index) => (
              <div key={index} className="historico-item">
                <div className="historico-info">
                  <div className="historico-produto">
                    <img 
                      src={item.foto_url || "https://placehold.co/40x40/1e3a5f/ffffff?text=P"}
                      alt={item.produto_nome}
                      className="historico-imagem"
                    />
                    <div>
                      <div className="historico-nome">{item.produto_nome}</div>
                      <div className="historico-cliente">{item.cliente_nome || 'Cliente'}</div>
                    </div>
                  </div>
                  <div className="historico-valores">
                    <div className="historico-valor">MZN {item.valor_final?.toLocaleString() || '—'}</div>
                    <div className="historico-comissao">Comissão: {item.comissao_pct}%</div>
                  </div>
                  <div className="historico-ganho">
                    <span className="ganho-valor">+ MZN {(item.ganho || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className="ganho-data">{new Date(item.data_venda).toLocaleDateString('pt-MZ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .ganhos-container {
          width: 100%;
        }
        .highlight-card .di-stat-value {
          font-size: 2rem;
          color: #10b981;
        }
        .ganhos-grafico {
          padding: 20px;
        }
        .grafico-barras {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .barra-item {
          width: 100%;
        }
        .barra-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .barra-mes {
          font-weight: 600;
          color: #1e3a5f;
        }
        .barra-valor {
          color: #10b981;
          font-weight: 600;
        }
        .barra-container {
          background: #e2e8f0;
          border-radius: 8px;
          height: 8px;
          overflow: hidden;
        }
        .barra {
          height: 100%;
          border-radius: 8px;
          transition: width 0.5s ease;
        }
        .barra-detalhes {
          margin-top: 4px;
          font-size: 11px;
          color: #64748b;
        }
        .historico-lista {
          max-height: 400px;
          overflow-y: auto;
        }
        .historico-item {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        .historico-item:hover {
          background: #f8fafc;
        }
        .historico-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .historico-produto {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 2;
        }
        .historico-imagem {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }
        .historico-nome {
          font-weight: 600;
          color: #1e293b;
        }
        .historico-cliente {
          font-size: 12px;
          color: #64748b;
        }
        .historico-valores {
          flex: 1;
          text-align: center;
        }
        .historico-valor {
          font-weight: 600;
          color: #1e293b;
        }
        .historico-comissao {
          font-size: 11px;
          color: #64748b;
        }
        .historico-ganho {
          text-align: right;
          min-width: 150px;
        }
        .ganho-valor {
          display: block;
          font-weight: 700;
          color: #10b981;
          font-size: 1.1rem;
        }
        .ganho-data {
          font-size: 11px;
          color: #64748b;
        }
        @media (max-width: 768px) {
          .historico-info {
            flex-direction: column;
            align-items: flex-start;
          }
          .historico-ganho {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default Ganhos;