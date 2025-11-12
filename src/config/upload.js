const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Garantir que os diretórios existem
const uploadsDir = path.resolve(__dirname, "..", "..", "uploads");
const publicUploadsDir = path.resolve(__dirname, "..", "..", "public", "uploads");

[uploadsDir, publicUploadsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuração padrão - mantém compatibilidade com rotas existentes
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads"),
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
    destination: publicUploadsDir,
    filename: (req, file, cb) => {
        let teste = file.originalname.split(" ");
        teste = String(teste);
        teste = teste.replace(/,/g, "");

        const ext = path.extname(file.originalname);
        const name = path.basename(teste, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

module.exports = {
    storage,
    storagePublic
}