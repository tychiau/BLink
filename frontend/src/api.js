// frontend/src/api.js
const API_BASE_URL = 'https://blink-oz62.onrender.com/auth'; // Adicionado /api para bater no prefixo do seu index.js

export const loginAPI = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // No seu controlador, você usa "email" e "password" (req.body)
        body: JSON.stringify({ email, password })
    });

    // É importante retornar o objecto todo para tratar erros e sucesso no componente
    return response.json();
};