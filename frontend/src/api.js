// frontend/src/api.js

// ==========================================
// CONFIGURAÇÃO BASE DA API
// ==========================================
// Para desenvolvimento local, use:
const API_BASE_URL = 'http://localhost:3000';
// Para produção (Render), use:
//const API_BASE_URL = 'https://blink-oz62.onrender.com';

// ==========================================
// FUNÇÃO AUXILIAR CENTRALIZADA
// ==========================================
const request = async (endpoint, method = 'GET', token = null, bodyData = null, customErrorMessage = 'Erro na requisição') => {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = { method, headers };
        if (bodyData) {
            config.body = JSON.stringify(bodyData);
        }

        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`📡 ${method} ${url}`);

        const response = await fetch(url, config);

        let data = null;
        try {
            data = await response.json();
        } catch (e) {
            console.warn('Resposta não é JSON:', e);
        }

        if (!response.ok) {
            return {
                error: true,
                status: response.status,
                message: data?.message || data?.error || customErrorMessage
            };
        }

        return data;
    } catch (error) {
        console.error(`${customErrorMessage}:`, error);
        return { error: true, message: 'Erro ao conectar ao servidor' };
    }
};

// ==========================================
// AUTENTICAÇÃO
// ==========================================
export const handleLogout = () => {
    localStorage.removeItem('blink_user');
    localStorage.removeItem('accessToken');
    window.location.href = '/auth';
};

export const loginGoogleAPI = async (googleData) => {
    return request('/auth/google-login', 'POST', null, googleData, 'Erro na API do Google');
};

export const loginAPI = async (email, password) => {
    return request('/auth/login', 'POST', null, { email, password }, 'Erro no login');
};

export const registerAPI = async (userData) => {
    return request('/auth/register', 'POST', null, userData, 'Erro no registo');
};

// ==========================================
// PRODUTOS API
// ==========================================
export const productsAPI = {
    getMyProducts: async (token) =>
        request('/api/meus-produtos', 'GET', token, null, 'Erro ao buscar produtos'),

    getStats: async (token) =>
        request('/api/meus-produtos/estatisticas', 'GET', token, null, 'Erro ao buscar estatisticas'),

    createProduct: async (token, productData) =>
        request('/api/produtos', 'POST', token, productData, 'Erro ao criar produto'),

    updateProduct: async (token, productId, productData) =>
        request(`/api/produto/${productId}`, 'PUT', token, productData, 'Erro ao atualizar produto'),

    updateStatus: async (token, productId, estado) =>
        request(`/api/produto/${productId}/status`, 'PATCH', token, { estado }, 'Erro ao atualizar status'),

    deleteProduct: async (token, productId) =>
        request(`/api/produto/${productId}`, 'DELETE', token, null, 'Erro ao deletar produto'),

    getProductById: async (token, productId) =>
        request(`/api/produto/${productId}`, 'GET', token, null, 'Erro ao buscar produto')
};

// ==========================================
// INTERMEDIÁRIO API
// ==========================================
export const intermediarioAPI = {
    // Dashboard
    getOportunidades: async (token) =>
        request('/api/intermediario/oportunidades', 'GET', token, null, 'Erro ao buscar oportunidades'),
    
    getMeusProdutosAtivos: async (token) =>
        request('/api/intermediario/produtos-ativos', 'GET', token, null, 'Erro ao buscar meus produtos'),
    
    getStats: async (token) =>
        request('/api/intermediario/stats', 'GET', token, null, 'Erro ao buscar estatísticas'),
    
    // Solicitações de intermediação
    solicitarIntermediacao: async (token, produtoId) =>
        request(`/api/intermediario/solicitar/${produtoId}`, 'POST', token, null, 'Erro ao solicitar intermediação'),
    
    cancelarSolicitacao: async (token, solicitacaoId) =>
        request(`/api/intermediario/solicitacao/${solicitacaoId}`, 'DELETE', token, null, 'Erro ao cancelar solicitação'),
    
    getAprovacoesPendentes: async (token) =>
        request('/api/intermediario/aprovacoes-pendentes', 'GET', token, null, 'Erro ao buscar aprovações pendentes'),
    
    // Perfil
    getPerfil: async (token) =>
        request('/api/intermediario/perfil', 'GET', token, null, 'Erro ao buscar perfil'),
    
    updatePerfil: async (token, perfilData) =>
        request('/api/intermediario/perfil', 'PUT', token, perfilData, 'Erro ao atualizar perfil'),
    
    updateFotoPerfil: async (token, fotoBase64) =>
        request('/api/intermediario/perfil/foto', 'PUT', token, { foto_base64: fotoBase64 }, 'Erro ao atualizar foto'),
    
    alterarSenha: async (token, senhaData) =>
        request('/api/intermediario/alterar-senha', 'PUT', token, senhaData, 'Erro ao alterar senha'),
    
    // Solicitações de compra (novas)
    getSolicitacoesCompra: async (token) =>
        request('/api/intermediario/solicitacoes-compra', 'GET', token, null, 'Erro ao buscar solicitações de compra'),
    
    aprovarSolicitacaoCompra: async (token, solicitacaoId) =>
        request(`/api/intermediario/solicitacoes-compra/${solicitacaoId}/aprovar`, 'POST', token, null, 'Erro ao aprovar compra'),
    
    rejeitarSolicitacaoCompra: async (token, solicitacaoId) =>
        request(`/api/intermediario/solicitacoes-compra/${solicitacaoId}/rejeitar`, 'POST', token, null, 'Erro ao rejeitar compra'),
};

// ==========================================
// USUÁRIOS API
// ==========================================
export const usuariosAPI = {
    getIntermediarios: async (token) =>
        request('/api/usuarios/intermediarios', 'GET', token, null, 'Erro ao buscar intermediários')
};

export const intermediariosAPI = {
    listarIntermediarios: async (token) =>
        request('/api/intermediario/listar', 'GET', token, null, 'Erro ao buscar intermediários')
};

// ==========================================
// VENDEDOR API
// ==========================================
export const vendedorAPI = {
    getSolicitacoesRecebidas: async (token) =>
        request('/api/intermediario/vendedor/solicitacoes', 'GET', token, null, 'Erro ao buscar solicitações'),
    
    aceitarSolicitacao: async (token, solicitacaoId) =>
        request(`/api/intermediario/vendedor/solicitacoes/${solicitacaoId}/aceitar`, 'POST', token, null, 'Erro ao aceitar solicitação'),
    
    rejeitarSolicitacao: async (token, solicitacaoId) =>
        request(`/api/intermediario/vendedor/solicitacoes/${solicitacaoId}/rejeitar`, 'POST', token, null, 'Erro ao rejeitar solicitação')
};

// ==========================================
// CLIENTE API
// ==========================================
export const clienteAPI = {
    getProdutosIntermediados: async (token) =>
        request('/api/requests/colunasProdutosIntermediado', 'GET', token, null, 'Erro ao buscar produtos intermediados'),
    
    solicitarCompra: async (token, data) =>
        request('/api/cliente/solicitar-compra', 'POST', token, data, 'Erro ao solicitar compra'),
    
    minhasSolicitacoes: async (token) =>
        request('/api/cliente/minhas-solicitacoes', 'GET', token, null, 'Erro ao buscar minhas solicitações'),
    
    cancelarSolicitacao: async (token, solicitacaoId) =>
        request(`/api/cliente/cancelar-solicitacao/${solicitacaoId}`, 'DELETE', token, null, 'Erro ao cancelar solicitação'),
};

// ==========================================
// EXPORTAÇÃO DEFAULT
// ==========================================
const apiService = {
    handleLogout,
    loginAPI,
    registerAPI,
    productsAPI,
    usuariosAPI,
    intermediariosAPI,
    intermediarioAPI,
    vendedorAPI,
    clienteAPI
};

export default apiService;
