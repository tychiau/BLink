// frontend/src/api.js

const API_BASE_URL = 'https://blink-oz62.onrender.com';
// const API_BASE_URL = 'http://localhost:3000';

export const handleLogout = () => {
    localStorage.removeItem('blink_user');
    localStorage.removeItem('accessToken');
    window.location.href = '/auth';
};

export const loginGoogleAPI = async (googleData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(googleData)
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: true, message: data.error || 'Erro no login com Google' };
        }

        return data;
    } catch (error) {
        console.error('Erro na API do Google:', error);
        return { error: true, message: 'Erro ao conectar ao servidor' };
    }
};

export const loginAPI = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            return { error: true, message: error.message || 'Erro no login' };
        }

        return await response.json();
    } catch (error) {
        console.error('Erro no login:', error);
        return { error: true, message: 'Erro ao conectar ao servidor' };
    }
};

export const registerAPI = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            return { error: true, message: error.message || 'Erro no registo' };
        }

        return await response.json();
    } catch (error) {
        console.error('Erro no registo:', error);
        return { error: true, message: 'Erro ao conectar ao servidor' };
    }
};

export const productsAPI = {
    getMyProducts: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/meus-produtos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                return { error: true, message: error.message || 'Erro ao buscar produtos' };
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    getStats: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/meus-produtos/estatisticas`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                return { error: true, message: error.message || 'Erro ao buscar estatisticas' };
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar estatisticas:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    createProduct: async (token, productData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();

            if (!response.ok) {
                return { error: true, message: data.message || 'Erro ao criar produto' };
            }

            return data;
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    updateProduct: async (token, productId, productData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/produto/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const error = await response.json();
                return { error: true, message: error.message || 'Erro ao atualizar produto' };
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    updateStatus: async (token, productId, estado) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/produto/${productId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado })
            });

            if (!response.ok) {
                const error = await response.json();
                return { error: true, message: error.message || 'Erro ao atualizar status' };
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    deleteProduct: async (token, productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/produto/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                return { error: true, message: error.message || 'Erro ao deletar produto' };
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    getProductById: async (token, productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/produto/${productId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                return { error: true, message: error.message || 'Erro ao buscar produto' };
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    }
};

export const intermediarioAPI = {
    getOportunidades: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/oportunidades`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return { error: true, status: response.status };
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar oportunidades:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    getMeusProdutosAtivos: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/produtos-ativos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return { error: true, status: response.status };
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar meus produtos:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    getStats: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/stats`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return { error: true, status: response.status };
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    solicitarIntermediacao: async (token, produtoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/solicitar/${produtoId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (!response.ok) {
                return { error: true, status: response.status, message: data.message };
            }
            return data;
        } catch (error) {
            console.error('Erro ao solicitar intermediação:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    cancelarSolicitacao: async (token, solicitacaoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/solicitacao/${solicitacaoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (!response.ok) {
                return { error: true, status: response.status, message: data.message };
            }
            return data;
        } catch (error) {
            console.error('Erro ao cancelar solicitação:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    getAprovacoesPendentes: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/aprovacoes-pendentes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return { error: true, status: response.status };
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar aprovações pendentes:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    }
};

export const usuariosAPI = {
    getIntermediarios: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/intermediarios`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar intermediários:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    }
};

export const intermediariosAPI = {
    listarIntermediarios: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/listar`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar intermediários:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    }
};

export const vendedorAPI = {
    getSolicitacoesRecebidas: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/vendedor/solicitacoes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar solicitações:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    aceitarSolicitacao: async (token, solicitacaoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/vendedor/solicitacoes/${solicitacaoId}/aceitar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao aceitar solicitação:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    rejeitarSolicitacao: async (token, solicitacaoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/intermediario/vendedor/solicitacoes/${solicitacaoId}/rejeitar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao rejeitar solicitação:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    }
};

export const clienteAPI = {
    getProdutosIntermediados: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/requests/colunasProdutosIntermediado`, {
                method: 'GET',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar produtos intermediados:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    }
};

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