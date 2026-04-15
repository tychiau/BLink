import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CadastroProduto from './pages/CadastroProduto';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Bem-vindo ao Blink</h1>} />
        <Route path="/cadastro-produto" element={<CadastroProduto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;