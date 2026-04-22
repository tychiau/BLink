// frontend/src/api.js

const API_BASE_URL = 'https://blink-oz62.onrender.com';

export const handleLogout = () => {
    localStorage.removeItem('blink_user');
    localStorage.removeItem('accessToken');
    window.location.href = '/auth';
}

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

            if (!response.ok) {
                const error = await response.json();
                return { error: true, message: error.message || 'Erro ao criar produto' };
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            return { error: true, message: 'Erro ao conectar ao servidor' };
        }
    },

    updateProduct: async (token, productId, productData) => {
        try {
            console.log('Atualizando produto:', productId, productData);

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

export default { handleLogout, loginAPI, registerAPI, productsAPI };