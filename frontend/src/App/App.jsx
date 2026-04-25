import { Routes, Route } from 'react-router-dom';
import AuthPage from '../pages/Auth/AuthPage';
import DashboardVendedor from '../pages/Vendedor/DashboardVendedor';
import ClienteDashboardPage from '../pages/Cliente/ClienteDashboardPage';
import DashboardIntermediario from '../pages/Intermediario/DashboardIntermediario';
import SolicitacoesVendedor from '../pages/Vendedor/SolicitacoesVendedor';
import SolicitacoesIntermediario from '../pages/Intermediario/SolicitacoesIntermediario';
import SolicitacoesCliente from '../pages/Cliente/SolicitacoesCliente';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      {/* VENDEDOR */}
      <Route path="/cadastro-produto" element={<DashboardVendedor />} />
      <Route path="/vendedor/dashboard" element={<DashboardVendedor />} />
      {/* CLIENTE */}
      <Route path="/cliente/dashboard" element={<ClienteDashboardPage />} />
      {/* INTERMEDIÁRIO */}
      <Route path="/intermediario/dashboard" element={<DashboardIntermediario />} />
      <Route path="/vendedor/solicitacoes" element={<SolicitacoesVendedor />} />
      <Route path="/intermediario/solicitacoes" element={<SolicitacoesIntermediario />} />
      <Route path="/cliente/solicitacoes" element={<SolicitacoesCliente />} />
      
      {/* FALLBACK */}
      <Route path="*" element={<div>Rota não encontrada</div>} />
    </Routes>
  );
}

export default App;