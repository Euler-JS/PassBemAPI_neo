const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Garantir que os diretórios existem
const uploadsDir = path.resolve(__dirname, "..", "..", "uploads");
const publicUploadsDir = path.resolve(__dirname, "..", "..", "public", "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(publicUploadsDir)) {
    fs.mkdirSync(publicUploadsDir, { recursive: true });
}

// Configuração padrão - mantém compatibilidade com rotas existentes
// IMPORTANTE: Usa nome original para manter compatibilidade na migração
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Usar nome original sem adicionar timestamp
        // Isso mantém compatibilidade com arquivos do servidor antigo
        cb(null, file.originalname);
    }
});

// Nova configuração para public/uploads (novas rotas)
// IMPORTANTE: Usa nome original para manter compatibilidade na migração
const storagePublic = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, publicUploadsDir);
    },
    filename: (req, file, cb) => {
        // Usar nome original sem adicionar timestamp
        // Isso mantém compatibilidade com arquivos do servidor antigo
        cb(null, file.originalname);
    }
});

// Criar instâncias de upload configuradas
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const uploadPublic = multer({ 
    storage: storagePublic,
    limits: { 
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 20 // Permitir até 20 arquivos
    }
});

module.exports = {
    storage,
    storagePublic,
    upload,
    uploadPublic
}