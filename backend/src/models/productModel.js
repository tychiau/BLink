const db = require('../config/db');

const Product = {
    getAll: async () => {
        try {
            console.log("A tentar conectar à DB...");
            const sql = 'SELECT nome, preco_minimo FROM produtos';
            console.log("A executar SQL:", sql);
            const [rows] = await db.execute(sql);
            console.log("Resultado:", rows);
            return rows;
        } catch (error) {
            console.error("Erro detalhado no Model:", error.message);
            throw error;
        }
    }
};

module.exports = Product;