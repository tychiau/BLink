const solicitacoes = [
  {
    id: 1,
    nome: "Clara Mendes",
    avaliacao: 4.8,
    estrelas: 4,
    produto: "Smartwatch Series X",
    imgProduto: "https://placehold.co/40x40/2d3748/ffffff?text=SW",
    imgPerfil: "https://placehold.co/48x48/4a90d9/ffffff?text=CM",
  },
  {
    id: 2,
    nome: "Ricardo Silva",
    avaliacao: 5.0,
    estrelas: 5,
    produto: "Fone Bluetooth Pro",
    imgProduto: "https://placehold.co/40x40/2d3748/ffffff?text=FB",
    imgPerfil: "https://placehold.co/48x48/4a90d9/ffffff?text=RS",
  },
];

function Estrelas({ quantidade }) {
  return (
    <span style={{ color: "#f6ad55", fontSize: 14 }}>
      {"★".repeat(quantidade)}{"☆".repeat(5 - quantidade)}
    </span>
  );
}

export default function SolicitacoesVendedor() {
  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* CABEÇALHO */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <img
          src="https://placehold.co/64x64/2d4a6e/ffffff?text=V"
          alt="Vendedor"
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
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
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
                  SOLICITOU VENDA DE:
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1a202c" }}>{s.produto}</p>
              </div>
            </div>

            {/* BOTÕES */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                style={{
                  background: "#2d4a6e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 24px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                Aprovar
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
                Rejeitar
              </button>
            </div>

            {/* VER PERFIL */}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#2d4a6e",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 8,
                textDecoration: "underline"
              }}
            >
              Ver Perfil Completo
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}