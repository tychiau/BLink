import { useNavigate } from "react-router-dom";

export default function VendedorRegistroPage() {
  const navigate = useNavigate();

  function handleContinuar() {
    navigate("/vendedor/dashboard");
  }

  return (
    <div className="min-h-dvh bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8">
        <div className="text-2xl font-extrabold text-slate-900">
          Registo do Vendedor
        </div>
        <div className="mt-2 text-sm text-slate-500">
          Preencha os seus dados para continuar.
        </div>

        {/* campos do registo — a tua colega pode preencher aqui */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest text-slate-400 mb-1.5">NOME DA EMPRESA</label>
            <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" placeholder="Ex: Blink Store" />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest text-slate-400 mb-1.5">TELEFONE</label>
            <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" placeholder="+258 84 000 0000" />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest text-slate-400 mb-1.5">CATEGORIA</label>
            <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400" placeholder="Ex: Electrónicos" />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleContinuar}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl text-sm font-semibold hover:bg-[#162d4a] transition-colors"
          >
            Continuar para Dashboard
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}