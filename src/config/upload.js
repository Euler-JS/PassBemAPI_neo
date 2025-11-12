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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        let teste = file.originalname.split(" ");
        teste = String(teste);
        teste = teste.replace(/,/g, "");

        const ext = path.extname(file.originalname);
        const name = path.basename(teste, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

// Nova configuração para public/uploads (novas rotas)
const storagePublic = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, publicUploadsDir);
    },
    filename: (req, file, cb) => {
        let teste = file.originalname.split(" ");
        teste = String(teste);
        teste = teste.replace(/,/g, "");

        const ext = path.extname(file.originalname);
        const name = path.basename(teste, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
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