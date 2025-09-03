const app = require('./index');

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3333;
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}

// Exportar para o Vercel
module.exports = app;