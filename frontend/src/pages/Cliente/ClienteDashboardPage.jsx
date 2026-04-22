import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../api";

const PRODUTOS = [
  {
    name: "Fone Wireless Ultra G2",
    price: "11.500 MZN",
    img: "https://source.unsplash.com/400x300/?headphones",
  },
  {
    name: "Tênis Performance Run",
    price: "5.850 MZN",
    img: "https://source.unsplash.com/400x300/?sneakers",
  },
  {
    name: "Relógio Minimalist White",
    price: "15.600 MZN",
    img: "https://source.unsplash.com/400x300/?watch",
  },
];

const VISTOS = [
  {
    name: "Mug Cerâmica",
    img: "https://source.unsplash.com/200x200/?mug,ceramic",
  },
  {
    name: "Poltrona",
    img: "https://source.unsplash.com/200x200/?armchair",
  },
  {
    name: "Laptop Stand",
    img: "https://source.unsplash.com/200x200/?laptop,stand",
  },
  {
    name: "Tablet Case",
    img: "https://source.unsplash.com/200x200/?tablet",
  },
];

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

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-sm font-extrabold text-slate-800">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function ClienteDashboardPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("blink_user") || "{}");
  const isVisitante = user?.visitante === true;

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
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
          <div className="flex items-center gap-3">
            <div className="hidden text-sm font-semibold text-slate-600 md:block">
              {isVisitante ? "Visitante" : (user.nome || "Utilizador")}
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
              {user.nome ? user.nome.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-xs font-extrabold text-slate-700">PERFIL DO CLIENTE</div>
          <div className="mb-4 text-xs text-slate-400">
            {isVisitante ? "Visitante" : (user.nome || "Utilizador")}
          </div>
          <div className="space-y-1">
            <NavItem active>INÍCIO</NavItem>
            <NavItem>MEUS PEDIDOS</NavItem>
            <NavItem>FAVORITOS</NavItem>
            <NavItem>NEGOCIAÇÕES</NavItem>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Sair
            </button>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="text-xs font-extrabold text-slate-500">DASHBOARD DO CLIENTE</div>
            <div className="mt-2 text-3xl font-extrabold leading-tight text-slate-900">
              {user.nome || "Cliente"} <br />
              Pronta para novas descobertas?
            </div>
            <div className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
              Confira suas recomendações personalizadas e acompanhe suas negociações ativas na região.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="h-11 rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white hover:bg-slate-800">
                Ver Favoritos
              </button>
              <button className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Minhas Compras
              </button>
            </div>
          </div>

          <Card title="Recomendados para Você">
            <div className="grid gap-3 md:grid-cols-3">
              {PRODUTOS.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-slate-200 bg-white p-3 hover:border-slate-300 transition cursor-pointer"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="mt-3 text-sm font-bold text-slate-800">{p.name}</div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">{p.price}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-[1fr_320px]">
            <Card title="Negociações Ativas">
              <div className="space-y-3">
                {[
                  { status: "EM PROGRESSO", title: 'MacBook Pro 14" M2' },
                  { status: "AGUARDANDO RESPOSTA", title: "Nike Air Max 270 Black" },
                ].map((n) => (
                  <div
                    key={n.title}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-slate-500">{n.status}</div>
                      <div className="mt-1 text-sm font-bold text-slate-800">{n.title}</div>
                      <div className="mt-1 text-xs text-slate-400">Intermediação • Proposta em aberto</div>
                    </div>
                    <button className="h-9 rounded-xl bg-emerald-500 px-4 text-xs font-extrabold text-white hover:bg-emerald-600">
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
                      className="aspect-square w-full rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="mt-2 text-xs font-bold text-slate-800">{item.name}</div>
                    <div className="mt-1 text-xs font-extrabold text-slate-900">— MZN</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <footer className="rounded-2xl border border-slate-200 bg-white p-6 text-xs text-slate-400">
            © 2026 BLINK. Todos os direitos reservados.
          </footer>
        </main>
      </div>
    </div>
  );
}