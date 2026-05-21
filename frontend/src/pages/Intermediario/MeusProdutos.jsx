// frontend/src/pages/Intermediario/MeusProdutos.jsx
import { useState, useEffect } from 'react';
import { intermediarioAPI } from '../../api';  // ← Corrigido


const MeusProdutos = ({ token, onShowNotification }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalGanhos: 0 });

  useEffect(() => {
    fetchMeusProdutos();
  }, []);

  const fetchMeusProdutos = async () => {
    try {
      const data = await intermediarioAPI.getMeusProdutosAtivos(token);
      
      if (data && !data.error && Array.isArray(data)) {
        const produtosFormatados = data.map(produto => {
          const preco = Number(produto.preco_minimo) || 0;
          const comissaoPercentual = Number(produto.comissao_intermediario) || 5;
          const comissaoValor = (preco * comissaoPercentual) / 100;
          
          return {
            id: produto.id,
            nome: produto.nome,
            preco_minimo: preco,
            comissao_intermediario: comissaoPercentual,
            comissao_valor: comissaoValor,
            foto_url: produto.foto_url,
            data_vinculo: produto.data_vinculo,
            vendedor_nome: produto.vendedor_nome,
            visualizacoes: Math.floor(Math.random() * 500) + 50
          };
        });
        
        setProdutos(produtosFormatados);
        const total = produtosFormatados.length;
        const totalGanhos = produtosFormatados.reduce((acc, p) => acc + p.comissao_valor, 0);
        setStats({ total, totalGanhos });
      } else {
        setProdutos([]);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const gerarLinkVenda = (produto) => {
    const link = `https://blink-oz62.onrender.com/produto/${produto.id}`;
    navigator.clipboard.writeText(link);
    onShowNotification('Link copiado para a área de transferência!', 'success');
  };

  const abrirWhatsApp = (produto) => {
    const mensagem = `Olá! Gostaria de saber mais sobre o produto: ${produto.nome}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="di-loading">
        <div className="spinner"></div>
        <p>Carregando seus produtos...</p>
      </div>
    );
  }

  return (
    <div className="meus-produtos-container">
      {/* Estatísticas */}
      <div className="di-stats-grid" style={{ marginBottom: 24 }}>
        <div className="di-stat-card">
          <div className="di-stat-top">
            <div className="di-stat-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
          <p className="di-stat-label">Total de Produtos</p>
          <p className="di-stat-value">{stats.total}</p>
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
          <p className="di-stat-label">Ganhos Potenciais</p>
          <p className="di-stat-value highlight">MZN {stats.totalGanhos.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
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
          <p className="di-stat-label">Visualizações Totais</p>
          <p className="di-stat-value">{produtos.reduce((acc, p) => acc + p.visualizacoes, 0)}</p>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="di-section-header">
        <h2 className="di-section-title">Meus Produtos Ativos</h2>
      </div>

      {produtos.length === 0 ? (
        <div className="di-empty-state">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
            <path d="M20 7h-4.18A3 3 0 0 0 16 5.18V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.18A3 3 0 0 0 8.18 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <p>Nenhum produto ativo</p>
          <small>Você ainda não tem produtos aprovados. Solicite intermediação de produtos disponíveis!</small>
        </div>
      ) : (
        <div className="di-produtos-grid">
          {produtos.map((produto) => (
            <div key={produto.id} className="di-produto-card">
              <img
                src={produto.foto_url || "https://placehold.co/300x150/1e3a5f/ffffff?text=Produto"}
                alt={produto.nome}
                className="di-produto-imagem"
              />
              <div className="di-produto-info">
                <div className="di-produto-header">
                  <h3 className="di-produto-nome">{produto.nome}</h3>
                  <span className="di-produto-badge di-badge-ativo">Ativo</span>
                </div>
                <div className="di-produto-categoria">
                  Em parceria com {produto.vendedor_nome || 'Vendedor'}
                </div>
                <div className="di-produto-preco">
                  MZN {produto.preco_minimo.toLocaleString()}
                </div>
                <div className="di-produto-comissao">
                  Sua comissão ({produto.comissao_intermediario}%): MZN {produto.comissao_valor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="di-produto-meta">
                  <span>📊 {produto.visualizacoes} visualizações</span>
                  {produto.data_vinculo && <span>📅 Desde {new Date(produto.data_vinculo).toLocaleDateString('pt-MZ')}</span>}
                </div>
                <div className="di-produto-ativo-acoes">
                  <button className="di-btn-link" onClick={() => gerarLinkVenda(produto)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Copiar Link
                  </button>
                  <button className="di-btn-whatsapp" onClick={() => abrirWhatsApp(produto)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .meus-produtos-container {
          width: 100%;
        }
        .di-produto-meta {
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: #64748b;
          margin: 8px 0;
        }
        .di-badge-ativo {
          background: #10b981;
          color: white;
        }
        .di-stat-value.highlight {
          color: #10b981;
          font-size: 1.75rem;
        }
      `}</style>
    </div>
  );
};

export default MeusProdutos;