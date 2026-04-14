const vendas = [
  { id: "#V001", produto: "Smartwatch Series X", comprador: "João Silva", intermediario: "Carlos M.", data: "09/04/2026", valor: "MZM 899", status: "Concluída" },
  { id: "#V002", produto: "Fone Bluetooth Pro", comprador: "Ana Costa", intermediario: "Bruno S.", data: "08/04/2026", valor: "MZM 450", status: "Em Progresso" },
  { id: "#V003", produto: "Smartwatch Series X", comprador: "Pedro J.", intermediario: "Ana Costa", data: "07/04/2026", valor: "MZM 899", status: "Concluída" },
  { id: "#V004", produto: "Fone Bluetooth Pro", comprador: "Maria L.", intermediario: "Bruno S.", data: "05/04/2026", valor: "MZM 450", status: "Cancelada" },
]

const statusStyle = {
  "Concluída": { background: "#f0fff4", color: "#38a169" },
  "Em Progresso": { background: "#ebf8ff", color: "#3182ce" },
  "Cancelada": { background: "#fff5f5", color: "#e53e3e" },
}

export default function Vendas() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Vendas</h1>
      <p style={{ color: "#718096", marginBottom: 24, fontSize: 14 }}>Historial de todas as suas vendas realizadas.</p>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f7f8fa", borderBottom: "1px solid #e2e8f0" }}>
              {["ID", "Produto", "Comprador", "Intermediário", "Data", "Valor", "Estado"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendas.map((v, i) => (
              <tr key={v.id} style={{ borderBottom: i < vendas.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#2d4a6e", fontWeight: 600 }}>{v.id}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>{v.produto}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#718096" }}>{v.comprador}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#718096" }}>{v.intermediario}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#718096" }}>{v.data}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700 }}>{v.valor}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ ...statusStyle[v.status], padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{v.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}