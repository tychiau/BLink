import { Routes, Route } from 'react-router-dom';
import AuthPage from '../pages/Auth/AuthPage';
import DashboardVendedor from '../pages/Vendedor/DashboardVendedor';
import ClienteDashboardPage from '../pages/Cliente/ClienteDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/cadastro-produto" element={<DashboardVendedor />} />
      <Route path="/vendedor/dashboard" element={<DashboardVendedor />} />
      <Route path="/cliente/dashboard" element={<ClienteDashboardPage />} />
      <Route path="*" element={<div>Rota não encontrada</div>} />
    </Routes>
  );
}

export default App;