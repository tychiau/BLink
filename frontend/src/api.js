const API_BASE_URL = 'https://blink-oz62.onrender.com';

// ==========================================
// FUNÇÃO AUXILIAR CENTRALIZADA (INTERNA)
// ==========================================
const request = async (endpoint, method = 'GET', token = null, bodyData = null, customErrorMessage = 'Erro na requisição') => {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers
        };

        if (bodyData) {
            config.body = JSON.stringify(bodyData);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Algumas APIs antigas do ficheiro não faziam o parse do JSON se o status fosse de erro, 
        // mas a maioria sim. O parse seguro é feito aqui:
        let data = null;
        try {
            data = await response.json();
        } catch (e) {
            // Caso a resposta venha vazia por parte do servidor
        }

        if (!response.ok) {
            // Mantém compatibilidade com funções que esperavam o status ou a estrutura antiga
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
// FLUXO DE AUTENTICAÇÃO E LOGOUT
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
// APIS AGRUPADAS
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

export const intermediarioAPI = {
    getOportunidades: async (token) =>
        request('/api/intermediario/oportunidades', 'GET', token, null, 'Erro ao buscar oportunidades'),

    getMeusProdutosAtivos: async (token) =>
        request('/api/intermediario/produtos-ativos', 'GET', token, null, 'Erro ao buscar meus produtos'),

    getStats: async (token) =>
        request('/api/intermediario/stats', 'GET', token, null, 'Erro ao buscar estatísticas'),

    solicitarIntermediacao: async (token, produtoId) =>
        request(`/api/intermediario/solicitar/${produtoId}`, 'POST', token, null, 'Erro ao solicitar intermediação'),

    cancelarSolicitacao: async (token, solicitacaoId) =>
        request(`/api/intermediario/solicitacao/${solicitacaoId}`, 'DELETE', token, null, 'Erro ao cancelar solicitação'),

    getAprovacoesPendentes: async (token) =>
        request('/api/intermediario/aprovacoes-pendentes', 'GET', token, null, 'Erro ao buscar aprovações pendentes'),

    // ========== MÉTODOS DE PERFIL ==========
    getPerfil: async (token) =>
        request('/api/intermediario/perfil', 'GET', token, null, 'Erro ao buscar perfil'),

    updatePerfil: async (token, perfilData) =>
        request('/api/intermediario/perfil', 'PUT', token, perfilData, 'Erro ao atualizar perfil'),

    updateFotoPerfil: async (token, fotoBase64) =>
        request('/api/intermediario/perfil/foto', 'PUT', token, { foto_base64: fotoBase64 }, 'Erro ao atualizar foto'),

    alterarSenha: async (token, senhaData) =>
        request('/api/intermediario/alterar-senha', 'PUT', token, senhaData, 'Erro ao alterar senha'),
}

export const usuariosAPI = {
    getIntermediarios: async (token) =>
        request('/api/usuarios/intermediarios', 'GET', token, null, 'Erro ao buscar intermediários')
};

// Nota: Existia uma redundância de endpoints parecidos aqui, mantidos para evitar quebras de importação externa
export const intermediariosAPI = {
    listarIntermediarios: async (token) =>
        request('/api/intermediario/listar', 'GET', token, null, 'Erro ao buscar intermediários')
};

export const vendedorAPI = {
    getSolicitacoesRecebidas: async (token) =>
        request('/api/intermediario/vendedor/solicitacoes', 'GET', token, null, 'Erro ao buscar solicitações'),

    aceitarSolicitacao: async (token, solicitacaoId) =>
        request(`/api/intermediario/vendedor/solicitacoes/${solicitacaoId}/aceitar`, 'POST', token, null, 'Erro ao aceitar solicitação'),

    rejeitarSolicitacao: async (token, solicitacaoId) =>
        request(`/api/intermediario/vendedor/solicitacoes/${solicitacaoId}/rejeitar`, 'POST', token, null, 'Erro ao rejeitar solicitação')
};

export const clienteAPI = {
    getProdutosIntermediados: async (token) =>
        request('/api/requests/colunasProdutosIntermediado', 'GET', token, null, 'Erro ao buscar produtos intermediados')
};

// ==========================================
// EXPORTAÇÃO DEFAULT (COMPATIBILIDADE)
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
