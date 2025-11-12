const path = require('path');

module.exports = {
    // Upload de múltiplos arquivos
    async uploadMultiple(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: "Nenhum arquivo foi enviado",
                    type: "Error"
                });
            }

            // Gerar URLs dos arquivos enviados
            const uploadedFiles = req.files.map(file => {
                return {
                    filename: file.filename,
                    originalname: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                    url: `${req.protocol}://${req.get('host')}/files/${file.filename}`
                };
            });

            return res.status(200).json({
                message: "Arquivos enviados com sucesso",
                type: "Success",
                files: uploadedFiles,
                count: uploadedFiles.length
            });
        } catch (error) {
            console.error('Erro ao fazer upload de arquivos:', error);
            return res.status(500).json({
                message: "Erro ao fazer upload dos arquivos",
                type: "Error",
                error: error.message
            });
        }
    },

    // Upload de um único arquivo
    async uploadSingle(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Nenhum arquivo foi enviado",
                    type: "Error"
                });
            }

            const uploadedFile = {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
            };

            return res.status(200).json({
                message: "Arquivo enviado com sucesso",
                type: "Success",
                file: uploadedFile
            });
        } catch (error) {
            console.error('Erro ao fazer upload do arquivo:', error);
            return res.status(500).json({
                message: "Erro ao fazer upload do arquivo",
                type: "Error",
                error: error.message
            });
        }
    }
};
