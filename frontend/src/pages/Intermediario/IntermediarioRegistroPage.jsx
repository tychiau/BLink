import { Link } from "react-router-dom";

export default function IntermediarioRegistroPage() {
  return (
    <div className="min-h-dvh bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8">
        <div className="text-2xl font-extrabold text-slate-900">
          Página do Intermediário
        </div>

        <div className="mt-2 text-sm text-slate-500">
          Tela base (em desenvolvimento)
        </div>

        <div className="mt-6">
          <Link
            to="/auth"
            className="text-sm font-semibold text-slate-600 hover:text-slate-800"
          >
            Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}