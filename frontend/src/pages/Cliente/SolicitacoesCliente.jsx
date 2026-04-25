const solicitacoes = [
  {
    id: 1,
    nome: "Carlos Intermediações",
    avaliacao: 4.8,
    estrelas: 4,
    produto: "MacBook Pro 14",
    status: "EM PROGRESSO",
    imgProduto: "https://placehold.co/40x40/2d3748/ffffff?text=MB",
    imgPerfil: "https://placehold.co/48x48/4a90d9/ffffff?text=CI",
  },
  {
    id: 2,
    nome: "Ana Silva Intermediações",
    avaliacao: 4.5,
    estrelas: 4,
    produto: "Nike Air Max 270 Black",
    status: "AGUARDANDO RESPOSTA",
    imgProduto: "https://placehold.co/40x40/2d3748/ffffff?text=NK",
    imgPerfil: "https://placehold.co/48x48/4a90d9/ffffff?text=AS",
  },
];

function Estrelas({ quantidade }) {
  return (
    <span style={{ color: "#f6ad55", fontSize: 14 }}>
      {"★".repeat(quantidade)}{"☆".repeat(5 - quantidade)}
    </span>
  );
}

const statusStyle = {
  "EM PROGRESSO": { background: "#ebf8ff", color: "#3182ce" },
  "AGUARDANDO RESPOSTA": { background: "#fff5f5", color: "#e53e3e" },
};

export default function SolicitacoesCliente() {
  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* CABEÇALHO */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <img
          src="https://placehold.co/64x64/2d4a6e/ffffff?text=C"
          alt="Cliente"
          style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
        />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a202c" }}>
          Solicitações Pendentes
        </h1>
      </div>

      {/* LISTA DE SOLICITAÇÕES */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {solicitacoes.map((s) => (
          <div key={s.id} style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 32 }}>

            {/* PERFIL DO INTERMEDIÁRIO */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={s.imgPerfil}
                  alt={s.nome}
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "#1a202c" }}>{s.nome}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Estrelas quantidade={s.estrelas} />
                    <span style={{ fontSize: 13, color: "#718096" }}>({s.avaliacao})</span>
                  </div>
                </div>
              </div>
              {/* STATUS */}
              <span style={{
                ...statusStyle[s.status],
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.5px"
              }}>
                {s.status}
              </span>
            </div>

            {/* PRODUTO SOLICITADO */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#f7f8fa",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 16
            }}>
              <img
                src={s.imgProduto}
                alt={s.produto}
                style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
              />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  PRODUTO EM NEGOCIAÇÃO:
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1a202c" }}>{s.produto}</p>
              </div>
            </div>

            {/* BOTÕES */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                style={{
                  background: "#25D366",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 24px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                💬 WhatsApp
              </button>
              <button
                style={{
                  background: "#fff",
                  color: "#e53e3e",
                  border: "2px solid #e53e3e",
                  borderRadius: 6,
                  padding: "10px 24px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}