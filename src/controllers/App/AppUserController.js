const UserAPP = require("../../models/UserApp");

module.exports ={

    async createTrial(req, res){
        const { deviceId } = req.body;

        if (!deviceId) {
            return res.status(400).json({ message: "deviceId é obrigatório" });
        }

        try {
            let user = await UserAPP.findOne({ deviceId, isTrial: true });

            if (!user) {
                user = await UserAPP.create({ deviceId, isTrial: true, trialTestsUsed: 0 });
            }

            return res.json({ id: user._id, trialTestsUsed: user.trialTestsUsed });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar sessão trial", error_detalhe: error });
        }
    },

    async login(req, res){

        const {numero, senha} = req.headers;

        if(!numero || !senha){
            return res.status(404).json({message:"bad request"})
        }

        try{

            const user = await UserAPP.findOne({numero})

            
            if(!user){
                return res.status(404).send({error:"Nenhuma conta associada a este número!"})
            }

            if(user?.senha !== senha){
                return res.status(401).json({error:"Senha Invalida"})
            }

            await user.populate("user_inf").execPopulate()

            return res.json(user)
        } catch (error) {
            //This is forwarded to the global error handler. Do not change it.
            return res.status(500).json({
                messagem:'Cadastro de Anucio',
                type: "Refused",
                error_detalhe:error,
                data:{},
            })
        }

    },

    async create(req, res){

        const {numero, senha} = req.body;

  

        try{

            const data = {numero, senha}

            let user = await UserAPP.findOne({numero: numero})

            if(!user){
                user = await UserAPP.create(data)

                return res.json("Sua conta foi criada com sucesso!")
            }


            return res.json("Este contacto encontra-se associado a uma conta.")

        } catch (error) {
            //This is forwarded to the global error handler. Do not change it.
            return res.status(500).json({
                messagem:'Cadastro de Anucio',
                type: "Refused",
                error_detalhe:error,
                data:{},
            })
        }
    }
}

