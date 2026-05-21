import { useState, useEffect, useRef } from 'react';
import { intermediarioAPI } from '../../api';  // ← Corrigido

const Chat = ({ token, perfil, onShowNotification }) => {
  const [conversas, setConversas] = useState([]);
  const [conversaAtiva, setConversaAtiva] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    carregarConversas();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const carregarConversas = async () => {
    try {
      // Buscar vendedores com quem o intermediário tem produtos ativos
      const produtosAtivos = await intermediarioAPI.getMeusProdutosAtivos(token);
      
      if (produtosAtivos && !produtosAtivos.error && Array.isArray(produtosAtivos)) {
        const vendedoresUnicos = new Map();
        
        produtosAtivos.forEach(produto => {
          if (produto.vendedor_id && !vendedoresUnicos.has(produto.vendedor_id)) {
            vendedoresUnicos.set(produto.vendedor_id, {
              id: produto.vendedor_id,
              nome: produto.vendedor_nome || 'Vendedor',
              produto: produto.nome,
              foto: produto.foto_url,
              ultimaMensagem: `Conversa sobre ${produto.nome}`,
              data: new Date().toISOString()
            });
          }
        });
        
        setConversas(Array.from(vendedoresUnicos.values()));
      }
      
      // Também adicionar conversas com vendedores de solicitações pendentes
      const solicitacoes = await intermediarioAPI.getAprovacoesPendentes(token);
      
      if (solicitacoes && !solicitacoes.error && Array.isArray(solicitacoes)) {
        solicitacoes.forEach(solic => {
          if (!conversas.find(c => c.id === solic.vendedor_id)) {
            setConversas(prev => [...prev, {
              id: solic.vendedor_id,
              nome: solic.vendedor_nome || 'Vendedor',
              produto: solic.produto_nome,
              foto: solic.foto_url,
              ultimaMensagem: `Solicitação pendente: ${solic.produto_nome}`,
              data: solic.data_solicitacao
            }]);
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarMensagens = async (conversaId) => {
    setLoading(true);
    try {
      // Simular carregamento de mensagens - em produção, buscar da API
      const mensagensExemplo = [
        {
          id: 1,
          texto: `Olá! Sou o ${conversas.find(c => c.id === conversaId)?.nome || 'Vendedor'}. Vi que você se interessou pelo produto.`,
          enviado_por: 'vendedor',
          data: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          texto: `Sim! Gostaria de saber mais detalhes sobre a intermediação.`,
          enviado_por: 'intermediario',
          data: new Date(Date.now() - 43200000).toISOString()
        },
        {
          id: 3,
          texto: `Ótimo! Podemos combinar uma reunião para alinharmos os detalhes?`,
          enviado_por: 'vendedor',
          data: new Date(Date.now() - 21600000).toISOString()
        }
      ];
      
      setMensagens(mensagensExemplo);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversa = async (conversa) => {
    setConversaAtiva(conversa);
    await carregarMensagens(conversa.id);
  };

  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim()) return;
    
    setEnviando(true);
    try {
      const novaMsg = {
        id: Date.now(),
        texto: novaMensagem,
        enviado_por: 'intermediario',
        data: new Date().toISOString()
      };
      
      setMensagens(prev => [...prev, novaMsg]);
      setNovaMensagem('');
      
      // Simular resposta automática (em produção, enviar para API)
      setTimeout(() => {
        const resposta = {
          id: Date.now() + 1,
          texto: `Obrigado pela mensagem! Entrarei em contato em breve sobre ${conversaAtiva?.produto || 'o produto'}.`,
          enviado_por: 'vendedor',
          data: new Date().toISOString()
        };
        setMensagens(prev => [...prev, resposta]);
        onShowNotification('Nova mensagem recebida!', 'success');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      onShowNotification('Erro ao enviar mensagem', 'error');
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const formatarData = (data) => {
    const date = new Date(data);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    
    if (date.toDateString() === hoje.toDateString()) {
      return date.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === ontem.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-MZ');
    }
  };

  if (loading && conversas.length === 0) {
    return (
      <div className="di-loading">
        <div className="spinner"></div>
        <p>Carregando conversas...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-layout">
        {/* Lista de Conversas */}
        <div className="chat-lista">
          <div className="chat-lista-header">
            <h3>Conversas</h3>
            <span className="chat-total">{conversas.length} conversas</span>
          </div>
          <div className="chat-conversas">
            {conversas.length === 0 ? (
              <div className="di-empty-state" style={{ padding: '40px 20px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p>Nenhuma conversa</p>
                <small>Quando você tiver produtos ativos, poderá conversar com os vendedores.</small>
              </div>
            ) : (
              conversas.map((conversa) => (
                <div
                  key={conversa.id}
                  className={`chat-conversa-item ${conversaAtiva?.id === conversa.id ? 'active' : ''}`}
                  onClick={() => handleSelectConversa(conversa)}
                >
                  <div className="chat-conversa-avatar">
                    <img 
                      src={conversa.foto || `https://ui-avatars.com/api/?name=${conversa.nome.charAt(0)}&background=1e3a5f&color=fff`}
                      alt={conversa.nome}
                    />
                  </div>
                  <div className="chat-conversa-info">
                    <div className="chat-conversa-nome">{conversa.nome}</div>
                    <div className="chat-conversa-produto">{conversa.produto}</div>
                    <div className="chat-conversa-mensagem">{conversa.ultimaMensagem}</div>
                  </div>
                  <div className="chat-conversa-data">
                    {formatarData(conversa.data)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="chat-area">
          {!conversaAtiva ? (
            <div className="chat-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h3>Selecione uma conversa</h3>
              <p>Escolha um vendedor para começar a conversar</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-header-avatar">
                    <img 
                      src={conversaAtiva.foto || `https://ui-avatars.com/api/?name=${conversaAtiva.nome.charAt(0)}&background=1e3a5f&color=fff`}
                      alt={conversaAtiva.nome}
                    />
                  </div>
                  <div>
                    <h4>{conversaAtiva.nome}</h4>
                    <p>Produto: {conversaAtiva.produto}</p>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message ${msg.enviado_por === 'intermediario' ? 'sent' : 'received'}`}
                  >
                    <div className="chat-message-bubble">
                      <p>{msg.texto}</p>
                      <span className="chat-message-time">{formatarData(msg.data)}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <textarea
                  className="chat-input"
                  placeholder="Digite sua mensagem..."
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={3}
                />
                <button 
                  className="chat-send-btn"
                  onClick={handleEnviarMensagem}
                  disabled={enviando || !novaMensagem.trim()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  {enviando ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .chat-container {
          width: 100%;
          height: calc(100vh - 200px);
          min-height: 500px;
        }
        .chat-layout {
          display: flex;
          height: 100%;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .chat-lista {
          width: 320px;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }
        .chat-lista-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
        }
        .chat-lista-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e3a5f;
          margin-bottom: 4px;
        }
        .chat-total {
          font-size: 12px;
          color: #64748b;
        }
        .chat-conversas {
          flex: 1;
          overflow-y: auto;
        }
        .chat-conversa-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 1px solid #e2e8f0;
        }
        .chat-conversa-item:hover {
          background: #f1f5f9;
        }
        .chat-conversa-item.active {
          background: #e2e8f0;
        }
        .chat-conversa-avatar img {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          object-fit: cover;
        }
        .chat-conversa-info {
          flex: 1;
        }
        .chat-conversa-nome {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }
        .chat-conversa-produto {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 4px;
        }
        .chat-conversa-mensagem {
          font-size: 12px;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chat-conversa-data {
          font-size: 10px;
          color: #94a3b8;
        }
        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }
        .chat-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #94a3b8;
        }
        .chat-placeholder h3 {
          font-size: 1.25rem;
          color: #64748b;
        }
        .chat-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
        }
        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-header-avatar img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          object-fit: cover;
        }
        .chat-header-info h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }
        .chat-header-info p {
          font-size: 12px;
          color: #64748b;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-message {
          display: flex;
        }
        .chat-message.sent {
          justify-content: flex-end;
        }
        .chat-message.received {
          justify-content: flex-start;
        }
        .chat-message-bubble {
          max-width: 70%;
          padding: 10px 14px;
          border-radius: 16px;
          position: relative;
        }
        .chat-message.sent .chat-message-bubble {
          background: #1e3a5f;
          color: white;
          border-bottom-right-radius: 4px;
        }
        .chat-message.received .chat-message-bubble {
          background: #f1f5f9;
          color: #1e293b;
          border-bottom-left-radius: 4px;
        }
        .chat-message-time {
          font-size: 10px;
          opacity: 0.7;
          display: block;
          margin-top: 4px;
        }
        .chat-input-area {
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
        }
        .chat-input {
          flex: 1;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-family: inherit;
          font-size: 14px;
          resize: none;
        }
        .chat-input:focus {
          outline: none;
          border-color: #1e3a5f;
        }
        .chat-send-btn {
          padding: 0 20px;
          background: #1e3a5f;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .chat-send-btn:hover:not(:disabled) {
          background: #2d4a6e;
          transform: translateY(-1px);
        }
        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .chat-lista {
            width: 280px;
          }
          .chat-conversa-mensagem {
            max-width: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;