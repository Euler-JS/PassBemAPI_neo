const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");

const routes = require("./routes");
const { setupWebsocket } = require("./websocket");
const { acess } = require("./src/database/Mongo");

// Só importar cron se não estiver em produção no Vercel
let MangerCron;
if (process.env.VERCEL !== '1') {
    MangerCron = require('./src/cron/index');
}

const app = express();

// Conectar ao MongoDB
mongoose.connect(acess, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    retryWrites: true
}).catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

const server = http.Server(app);

// Configurar WebSocket apenas se não estiver no Vercel
if (process.env.VERCEL !== '1') {
    setupWebsocket(server);
}

// Middlewares
app.use(express.json({
    limit: '100mb'
}));

app.use(cors());

// Middleware para servir arquivos estáticos
// No Vercel, você deve usar um serviço de armazenamento externo
if (process.env.VERCEL !== '1') {
    app.use("/files", express.static(path.resolve(__dirname, "uploads")));
} else {
    // Redirecionar arquivos para um CDN ou serviço de storage
    app.use("/files", (req, res) => {
        // Exemplo: redirecionar para Cloudinary ou S3
        res.status(404).json({ 
            message: "Arquivos devem ser servidos via CDN em produção" 
        });
    });
}

// Rotas
app.use(routes);

// Health check endpoint para Coolify e monitoramento
app.get('/health', (req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };

    const statusCode = mongoose.connection.readyState === 1 ? 200 : 503;
    res.status(statusCode).json(healthCheck);
});

// Rota de saúde para verificar se a API está funcionando
app.get('/', (req, res) => {
    res.json({ 
        message: 'PasseBem API funcionando!', 
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Inicializar cron jobs apenas em desenvolvimento local
if (process.env.VERCEL !== '1' && MangerCron) {
    MangerCron.run();
}

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    const port = process.env.PORT || 3333;
    server.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
        if (MangerCron) {
            console.log('Cron jobs iniciados');
        }
    });
}

module.exports = app;