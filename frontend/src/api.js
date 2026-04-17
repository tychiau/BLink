// frontend/src/api.js
const API_BASE_URL = 'https://blink-oz62.onrender.com'; // Base URL do backend

export const loginAPI = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    } catch (error) {
        console.error('Erro no login:', error);
        return { error: 'Erro ao conectar ao servidor' };
    }
};

export const registerAPI = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    } catch (error) {
        console.error('Erro no registo:', error);
        return { error: 'Erro ao conectar ao servidor' };
    }
};

// API para produtos
export const productsAPI = {
    // Buscar produtos do vendedor logado
    getMyProducts: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/meus-produtos`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.json();
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return { error: 'Erro ao conectar ao servidor' };
        }
    },

    // Buscar estatísticas do vendedor
    getStats: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/meus-produtos/estatisticas`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.json();
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return { error: 'Erro ao conectar ao servidor' };
        }
    },

    // Criar novo produto
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
            return response.json();
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            return { error: 'Erro ao conectar ao servidor' };
        }
    },

    // Atualizar status do produto
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
            return response.json();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            return { error: 'Erro ao conectar ao servidor' };
        }
    },

    // Deletar produto
    deleteProduct: async (token, productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/produto/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.json();
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            return { error: 'Erro ao conectar ao servidor' };
        }
    },

    // Buscar produto por ID
    getProductById: async (token, productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/produto/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.json();
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return { error: 'Erro ao conectar ao servidor' };
        }
    }
};