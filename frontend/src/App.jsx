import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardVendedor from './pages/Vendedor/DashboardVendedor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Produto */}
        <Route path="/cadastro-produto" element={<DashboardVendedor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;