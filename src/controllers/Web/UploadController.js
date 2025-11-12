module.exports = {
    // Upload de um único arquivo
    single: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Nenhum arquivo foi enviado",
                    type: "Error"
                });
            }

            const fileUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;

            return res.status(200).json({
                message: "Arquivo enviado com sucesso",
                type: "Success",
                file: {
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    url: fileUrl
                }
            });
        } catch (error) {
            console.error("Erro no upload single:", error);
            return res.status(500).json({
                message: "Erro ao fazer upload do arquivo",
                type: "Error",
                error: error.message
            });
        }
    },

    // Upload de múltiplos arquivos
    multiple: async (req, res) => {
        try {
            console.log('=== DEBUG UPLOAD MULTIPLE ===');
            console.log('req.files:', req.files);
            console.log('req.body:', req.body);
            console.log('Content-Type:', req.headers['content-type']);
            
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: "Nenhum arquivo foi enviado",
                    type: "Error"
                });
            }

            const filesInfo = req.files.map((file) => ({
                filename: file.filename,
                originalname: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                url: `${req.protocol}://${req.get('host')}/files/${file.filename}`
            }));

            return res.status(200).json({
                message: "Arquivos enviados com sucesso",
                type: "Success",
                count: req.files.length,
                files: filesInfo
            });
        } catch (error) {
            console.error("Erro no upload multiple:", error);
            return res.status(500).json({
                message: "Erro ao fazer upload dos arquivos",
                type: "Error",
                error: error.message
            });
        }
    }
};
