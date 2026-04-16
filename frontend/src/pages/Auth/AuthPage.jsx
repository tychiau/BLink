import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../api";

function cn(...v) {
  return v.filter(Boolean).join(" ");
}

const PERFIS = [
  {
    id: "cliente",
    label: "Cliente",
    desc: "Compre em MZM com total segurança.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
      </svg>
    ),
  },
  {
    id: "vendedor",
    label: "Vendedor",
    desc: "Venda em MZM e escale seu negócio.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    id: "intermediario",
    label: "Intermediário",
    desc: "Ganhe comissões em MZM por conexão.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    label: "Segurança em Moçambique",
    desc: "Transações em Meticais protegidas por criptografia de ponta para o mercado nacional.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "Insights de Mercado Local",
    desc: "Dashboards detalhados com métricas reais para o contexto económico de 2026.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    label: "Ecossistema Conectado",
    desc: "Intermediários locais prontos para agilizar negociações em todo o território nacional.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("entrar");
  const [perfil, setPerfil] = useState("vendedor");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [remember, setRemember] = useState(false);
  const [nome, setNome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleLogin = async (e) => {
    // Verificação segura do evento
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!email || !senha) {
      alert("Por favor, preencha o email e a senha.");
      return;
    }

    try {
      // CHAMADA CORRECTA: loginAPI já faz o fetch e devolve o json
      const data = await loginAPI(email, senha);

      if (data.error) {
        alert(data.error || "Erro ao fazer login");
        return;
      }

      // Guardar dados
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("blink_user", JSON.stringify(data.user));

      // Redireccionamento
      const userRole = data.user.tipo_usuario;
      if (userRole === "cliente") {
        navigate("/cliente/dashboard")
      } else if (userRole === "vendedor") {
        navigate("/vendedor/dashboard");
      } else if (userRole === "intermediario") {
        navigate("/intermediario/dashboard");
      }

    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("Erro ao conectar ao servidor. Verifique se o Backend está ligado.");
    }
  }

const handleRegister = async () => {
  if (!email || !nome || !senha || !perfil) {
    alert("Preencha todos os campos");
    return;
  }

  try {
    const data = await registerAPI({
      nome,
      email,
      senha,
      tipo_usuario: perfil
    });

    if (!data || data.error) {
      alert(data?.error || "Erro no registo");
      return;
    }

    const { token, user } = data;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("blink_user", JSON.stringify(user));

    redirectByRole(user.tipo_usuario);

  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor");
  }
};
  function handleVisitante() {
    localStorage.setItem("blink_user", JSON.stringify({ perfil: "cliente", visitante: true }));
    navigate("/cliente/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm overflow-hidden grid grid-cols-2">

        {/* ── PAINEL ESQUERDO ── */}
        <div className="p-12 border-r border-gray-100">
          <p className="text-xl font-bold text-[#1e3a5f] tracking-tight mb-1">BLINK</p>
          <p className="text-sm text-gray-500 mb-8">A nova era das conexões comerciais em Moçambique.</p>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-7">
            {["entrar", "registrar"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "pb-2 text-sm font-medium capitalize transition-colors",
                  tab === t
                    ? "text-[#1e3a5f] border-b-2 border-[#1e3a5f]"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === "entrar" ? (
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-gray-400 mb-1.5">EMAIL</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    type="email"
                    placeholder="nome@exemplo.co.mz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-300 bg-transparent"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-gray-400 mb-1.5">SENHA</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showSenha ? "text" : "password"}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-300 bg-transparent"
                  />
                  <button onClick={() => setShowSenha(!showSenha)} className="text-gray-400 hover:text-gray-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Profile Selector */}
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-gray-400 mb-2">SELECIONE SEU PERFIL</p>
                <div className="grid grid-cols-3 gap-2">
                  {PERFIS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPerfil(p.id)}
                      className={cn(
                        "rounded-xl p-3 text-left transition-all",
                        perfil === p.id
                          ? "border-2 border-[#1e3a5f] bg-gray-50 text-[#1e3a5f]"
                          : "border border-gray-200 text-gray-500 hover:border-gray-300"
                      )}
                    >
                      <div className="mb-2">{p.icon}</div>
                      <div className="text-xs font-semibold mb-1">{p.label}</div>
                      <div className="text-[10px] leading-tight text-gray-400">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-3.5 h-3.5"
                  />
                  Lembrar de mim
                </label>
                <button type="button" className="text-xs text-[#1e3a5f] hover:underline">Esqueceu a senha?</button>
              </div>

              {/* Botão entrar */}
              <button
                type="button"
                onClick={handleLogin}
                className="w-full py-3 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors"
              >
                Entrar na Conta
              </button>

              {/* Botão visitante  aqui vamos fazer tipoo só aparece se perfil for cliente */}
              {perfil === "cliente" && (
                <button
                  onClick={handleVisitante}
                  className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Entrar como visitante
                </button>
              )}

              {/* Social */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] tracking-widest text-gray-400">OU CONTINUE COM</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Google", color: "#4285F4" },
                  { label: "Facebook", color: "#1877F2" },
                ].map(({ label, color }) => (
                  <button
                    key={label}
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span style={{ color, fontWeight: 700, fontSize: 13 }}>■</span> {label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── REGISTRAR ── */
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-gray-400 mb-2">SELECIONE SEU PERFIL</p>
                <div className="grid grid-cols-3 gap-2">
                  {PERFIS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPerfil(p.id)}
                      className={cn(
                        "rounded-xl p-3 text-left transition-all",
                        perfil === p.id
                          ? "border-2 border-[#1e3a5f] bg-gray-50 text-[#1e3a5f]"
                          : "border border-gray-200 text-gray-500 hover:border-gray-300"
                      )}
                    >
                      <div className="mb-2">{p.icon}</div>
                      <div className="text-xs font-semibold mb-1">{p.label}</div>
                      <div className="text-[10px] leading-tight text-gray-400">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            <div>
  <label className="block text-[10px] font-semibold tracking-widest text-gray-400 mb-1.5">NOME</label>
  <input type="text" placeholder="Nome" value={nome}
    onChange={(e) => setNome(e.target.value)}
    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f] placeholder-gray-300" />
</div>
<div>
  <label className="block text-[10px] font-semibold tracking-widest text-gray-400 mb-1.5">EMAIL</label>
  <input type="email" placeholder="Email" value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f] placeholder-gray-300" />
</div>
<div>
  <label className="block text-[10px] font-semibold tracking-widest text-gray-400 mb-1.5">SENHA</label>
  <input type="password" placeholder="Senha" value={senha}
    onChange={(e) => setSenha(e.target.value)}
    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f] placeholder-gray-300" />
</div>
<div>
  <label className="block text-[10px] font-semibold tracking-widest text-gray-400 mb-1.5">CONFIRMAR SENHA</label>
  <input type="password" placeholder="Confirmar senha" value={confirmarSenha}
    onChange={(e) => setConfirmarSenha(e.target.value)}
    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f] placeholder-gray-300" />
</div>
              <button type="button" onClick={handleRegister}  className="w-full py-3 bg-[#1e3a5f] text-white rounded-xl text-sm font-medium hover:bg-[#162d4a] transition-colors">
                Criar conta
              </button>
            </div>
          )}
        </div>

        {/*  PAINEL DIREITO  */}
        <div className="bg-gray-50 p-12 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-10">
              Expanda seus <span className="text-[#1e3a5f]">horizontes</span> em Maputo e além.
            </h2>
            <div className="space-y-6">
              {FEATURES.map((f) => (
                <div key={f.label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">{f.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Depoimento feticheee sei la */}
          <div className="mt-8 border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold">
                RM
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-gray-500">RICARDO MENDONÇA • TOP VENDEDOR</p>
                <p className="text-[10px] text-gray-400">MAPUTO</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              "Em 2026, esta plataforma é o motor do meu negócio. O suporte em Moçambique é impecável e as vendas em MZM crescem mensalmente."
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between px-8 py-3 text-[10px] text-gray-400 tracking-widest">
        <span>© 2026 MARKETPLACE MOZAMBIQUE INC.</span>
        <div className="flex gap-6">
          <span className="cursor-pointer hover:text-gray-600">SUPORTE</span>
          <span className="cursor-pointer hover:text-gray-600">PRIVACIDADE</span>
          <span className="cursor-pointer hover:text-gray-600">TERMOS</span>
        </div>
      </div>
    </div>
  );
}
