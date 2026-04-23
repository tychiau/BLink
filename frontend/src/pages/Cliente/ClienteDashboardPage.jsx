import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../api";

// ─────────────────────────────────────────────
// DADOS ESTÁTICOS
// ─────────────────────────────────────────────

const PRODUTOS = [
  {
    name: "Fone Wireless Ultra G2",
    price: "11.500 MZN",
    category: "TECNOLOGIA",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
  {
    name: "Tênis Performance Run",
    price: "5.850 MZN",
    category: "ESPORTES",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  },
  {
    name: "Relógio Minimalist White",
    price: "15.600 MZN",
    category: "ACESSÓRIOS",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  },
];

const VISTOS = [
  {
    name: "Mug Cerâmica Art",
    price: "1.150 MZN",
    img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&h=200&fit=crop",
  },
  {
    name: "Poltrona Nordic L...",
    price: "20.540 MZN",
    img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop",
  },
  {
    name: "Laptop Stand Pro",
    price: "3.120 MZN",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop",
  },
  {
    name: "Tablet Case Slim",
    price: "1.625 MZN",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop",
  },
];

const NEGOCIACOES = [
  {
    status: "EM PROGRESSO",
    statusColor: "text-emerald-600",
    title: 'MacBook Pro 14" M2',
    intermediario: "Carlos Intermediações",
    detalhe: "A proposta de 87.500 MZN foi aceite...",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop",
  },
  {
    status: "AGUARDANDO RESPOSTA",
    statusColor: "text-amber-500",
    title: "Nike Air Max 270 Black",
    intermediario: "Ana Silva Intermediações",
    detalhe: "Enviei a contra-proposta. Retorno em breve.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
  },
];

const NOTIFICACOES_INICIAIS = [];

// ─────────────────────────────────────────────
// COMPONENTES INTERNOS
// ─────────────────────────────────────────────

function NavItem({ active, children }) {
  return (
    <button
      type="button"
      className={[
        "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
        active
          ? "bg-slate-100 text-slate-900"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Card({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-extrabold text-slate-800">{title}</div>
        {action && (
          <button className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function UserAvatar({ user, size = "md" }) {
  const nome = user?.visitante ? "Visitante" : (user?.nome || "U");
  const inicial = nome.charAt(0).toUpperCase();
  const foto = user?.foto_url || user?.picture || null;

  const sizes = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center font-bold text-slate-500 select-none`}
    >
      {foto ? (
        <>
          <img
            src={foto}
            alt={nome}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <span
            style={{ display: "none" }}
            className="items-center justify-center w-full h-full"
          >
            {inicial}
          </span>
        </>
      ) : (
        <span className="flex items-center justify-center w-full h-full">
          {inicial}
        </span>
      )}
    </div>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICACOES_INICIAIS);

  const naoLidas = notifs.filter((n) => !n.lida).length;

  const marcarTodasLidas = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, lida: true })));

  const marcarLida = (id) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );

  return (
    <div className="relative">
      {/* Botão sininho */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition"
        aria-label="Notificações"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {naoLidas > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white leading-none">
            {naoLidas}
          </span>
        )}
      </button>

      {/* Dropdown de notificações */}
      {open && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-11 z-20 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">

            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="text-sm font-extrabold text-slate-800">
                Notificações
                {naoLidas > 0 && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-600">
                    {naoLidas} novas
                  </span>
                )}
              </div>
              {naoLidas > 0 && (
                <button
                  onClick={marcarTodasLidas}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition"
                >
                  Marcar todas lidas
                </button>
              )}
            </div>

            {/* Lista */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {notifs.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => marcarLida(n.id)}
                  className={[
                    "w-full text-left px-4 py-3 flex gap-3 hover:bg-slate-50 transition",
                    !n.lida ? "bg-blue-50/60" : "bg-white",
                  ].join(" ")}
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-base">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-extrabold text-slate-800 truncate">
                        {n.titulo}
                      </div>
                      {!n.lida && (
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {n.descricao}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold text-slate-400">
                      {n.tempo}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Rodapé */}
            <div className="border-t border-slate-100 px-4 py-3">
              <button className="w-full rounded-xl bg-slate-50 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-100 transition">
                Ver todas as notificações
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────

export default function ClienteDashboardPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("blink_user") || "{}");
  const isVisitante = user?.visitante === true;
  const nomeDisplay = isVisitante ? "Visitante" : (user.nome || "Cliente");

  return (
    <div className="min-h-dvh bg-slate-50">

      {/* ── HEADER ── */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

          {/* Esquerda: logo + navegação */}
          <div className="flex items-center gap-8">
            <div className="text-lg font-extrabold tracking-tight text-slate-900">
              BLINK
            </div>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-500 md:flex">
              <button type="button" className="hover:text-slate-700">Categorias</button>
              <button type="button" className="hover:text-slate-700">Como Funciona</button>
              <button type="button" className="hover:text-slate-700">Seja Intermediário</button>
            </nav>
          </div>

          {/* Direita: sininho + nome + avatar */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="hidden text-sm font-semibold text-slate-600 md:block">
              {nomeDisplay}
            </div>
            <UserAvatar user={user} size="md" />
          </div>

        </div>
      </header>

      {/* ── LAYOUT PRINCIPAL ── */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[240px_1fr]">

        {/* ── SIDEBAR ── */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 h-fit">
          <div className="mb-1 text-xs font-extrabold text-slate-700">PERFIL DO CLIENTE</div>
          <div className="mb-4 text-xs text-slate-400">
            {isVisitante ? "Visitante" : (user.nome || "Utilizador")}
          </div>
          <div className="space-y-1">
            <NavItem active>INÍCIO</NavItem>
            <NavItem>MEUS PEDIDOS</NavItem>
            <NavItem>FAVORITOS</NavItem>
            <NavItem>NEGOCIAÇÕES</NavItem>
            <NavItem>MENSAGENS</NavItem>
            <NavItem>CONFIGURAÇÕES</NavItem>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Sair
            </button>
          </div>
        </aside>

        {/* ── CONTEÚDO PRINCIPAL ── */}
        <main className="space-y-4">

          {/* Hero */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="text-xs font-extrabold text-slate-500 tracking-widest">
              DASHBOARD DO CLIENTE
            </div>
            <div className="mt-2 text-3xl font-extrabold leading-tight text-slate-900">
              Olá, {nomeDisplay}! <br />
              Pronta para novas descobertas?
            </div>
            <div className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
              Confira suas recomendações personalizadas e acompanhe suas negociações ativas na região.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="h-11 rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white hover:bg-slate-800 transition">
                Ver Favoritos
              </button>
              <button className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Minhas Compras
              </button>
            </div>
          </div>

          {/* Recomendados para Você */}
          <Card title="Recomendados para Você" action="‹ ›">
            <div className="grid gap-3 md:grid-cols-3">
              {PRODUTOS.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-slate-200 bg-white p-3 hover:border-slate-300 transition cursor-pointer"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="aspect-[4/3] w-full rounded-xl object-cover bg-slate-100"
                    loading="lazy"
                  />
                  <div className="mt-3 text-[10px] font-extrabold text-slate-400 tracking-widest">
                    {p.category}
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800">{p.name}</div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">{p.price}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Negociações Ativas + Vistos Recentemente */}
          <div className="grid gap-4 md:grid-cols-[1fr_320px]">

            <Card title="Negociações Ativas" action="Ver todos">
              <div className="space-y-3">
                {NEGOCIACOES.map((n) => (
                  <div
                    key={n.title}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <img
                      src={n.img}
                      alt={n.title}
                      className="h-12 w-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-[10px] font-extrabold tracking-widest ${n.statusColor}`}>
                        ● {n.status}
                      </div>
                      <div className="mt-0.5 text-sm font-bold text-slate-800 truncate">
                        {n.title}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400 flex items-center gap-1">
                        <span className="inline-flex h-4 w-4 rounded-full bg-slate-200 text-[8px] items-center justify-center font-bold flex-shrink-0">
                          {n.intermediario.charAt(0)}
                        </span>
                        {n.intermediario}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400 truncate">
                        {n.detalhe}
                      </div>
                    </div>
                    <button className="h-9 rounded-xl bg-emerald-500 px-4 text-xs font-extrabold text-white hover:bg-emerald-600 transition flex-shrink-0">
                      WhatsApp
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Vistos Recentemente">
              <div className="grid grid-cols-2 gap-3">
                {VISTOS.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-slate-200 bg-white p-3 hover:border-slate-300 transition cursor-pointer"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="aspect-square w-full rounded-xl object-cover bg-slate-100"
                      loading="lazy"
                    />
                    <div className="mt-2 text-xs font-bold text-slate-800 truncate">{item.name}</div>
                    <div className="mt-1 text-xs font-extrabold text-slate-900">{item.price}</div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Footer */}
          <footer className="rounded-2xl border border-slate-200 bg-white p-6 text-xs text-slate-400">
            © 2026 BLINK. Todos os direitos reservados.
          </footer>

        </main>
      </div>
    </div>
  );
}
