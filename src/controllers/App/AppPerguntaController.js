const Temas = require("../../models/Temas");
const Perguntas = require("../../models/Pergunta");
const Provas = require('../../models/Provas');
const Creditos = require('../../models/Creditos');
const UserAPP = require('../../models/UserApp');

/* const axios = require("axios")

const api =axios.create({
    baseURL: "https://api.sandbox.vm.co.mz:18352"
}) */

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }


module.exports = {

    async index(req, res){

        const user = req.headers.authorization

        try{

            const temas = await Temas.find({ 
                "numero": { "$gte": 25 },
                "_id": { "$ne": "6107d6a6027a850012c3d6d0" }
            })

            const creditos = await Creditos.findOne({user: user})


            return res.json({temas, creditos})

        }catch{return res.status(400).json({message:"error"})}
        
        
    },


    async create(req, res){

        const {item, tipo} = req.body;
        const {authorization} = req.headers

        let results;


        if(!authorization) return res.status(401).json({message:' you don`t have permition'})

        try{
            // Verificar se é utilizador trial e se esgotou os testes gratuitos
            const userDoc = await UserAPP.findById(authorization).catch(() => null);
            if (userDoc && userDoc.isTrial) {
                if (tipo !== 'Geral') {
                    return res.status(403).json({ message: 'trial_type_restricted', info: 'Utilizadores em modo trial só podem fazer testes do tipo Geral.' });
                }
                if (userDoc.trialTestsUsed >= 2) {
                    return res.status(403).json({ message: 'trial_exhausted', info: 'Limite de testes gratuitos atingido. Cria uma conta para continuar.' });
                }
            }

            if(tipo == 'Tematica'){
                results = await Perguntas.find({tema_id:item._id})
            } 
            else if(tipo == 'Profissional'){
                // Busca temas profissionais (numero >= 25)
                const temasProfissionais = await Temas.find({"numero": {"$gte": 25}})
                // Extrai os IDs dos temas
                const temasIds = temasProfissionais.map(t => "6107d6a6027a850012c3d6d0")
                // Busca perguntas desses temas
                results = await Perguntas.find({tema_id: {$in: temasIds}})
            }
            else {
                // Tipo "Geral" - busca todas as perguntas, exceto do tema profissional
                results = await Perguntas.find({tema_id: {$ne: '6107d6a6027a850012c3d6d0'}})
            }
            
            shuffle(results)
            
            if(!results){
                return res.status(404)
            }

            const data = {
                tipo,
                user: authorization,
                tema:item._id,
                tem_nome: item.nome,

            }

            const prova = await Provas.create(data)

            // Incrementar contador de testes do utilizador trial
            if (userDoc && userDoc.isTrial) {
                await UserAPP.findByIdAndUpdate(authorization, { $inc: { trialTestsUsed: 1 } });
            }

            return res.json({results,prova})
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
                                        


/////mpesa


   /* const data = {
            "input_TransactionReference": "T12344C",
            "input_CustomerMSISDN": "258845202445",
            "input_Amount": "10",
            "input_ThirdPartyReference": "Iphonr",
            "input_ServiceProviderCode": "171717"
        }
        
        api.post("/ipg/v1x/c2bPayment/singleStage/",data,{
            headers:{
                Authorization: "Bearer j486UU8sjiP25PUpBAL88lkDPDaVuqNkd5lAcvfcBQ+0bxNF9UzcSn7q/mDYaSnnvuW2Go7jOiaETGAzKmumNhbKF5lVK4j+q+3LbCPWm6+jFnU53aPYvgfytTcYW0CWOE4LnBL177QSY5Y68FKA4UAGQ7xlBEXouo19XkyfFODI3vF8S3SxoDQ935zrbgMU7F8pdzYItLeBbxSvFqBEUoiyNk4sFJ0SKc3NAQxJi45KkHoB24HRgX+/f2VowFPkewTaxLm5WwLGd/xp8aUNkNSOSSo0l1VbfczJ+dgJdodPQdaIW/5JeICSOe/oTamuHhH1WSnDSSQ5pVc7OonLKUXQ+/gB/Awv8+Zbi00LXUf34KAPTYlzRZimP08N8CfjtehtQNM1IeY6/WKPVzy6F/6wvGoHkN2CEXJNramFtibdMFZCIC7tuXho3hoxNfbH6iJ1Pech9TaGvDUJab3PkwWOTIzpl9z77N4am44hwuD/WFBlxZcmtboRDconP98A51AsSCrFdlrvU036OhqB0tpRTXzOxu/k33ls1S7VnxrEitoGB2Yfii6AFumzjdoeJhGoWyn+pW+rWqypARY8VOFNOIxeOPAf9ItIVY9NujZvmEYPmp9+pneqR0IuKNxH6JSot1N5aV+CUNrVK64nP7K6KCq+lW6LfZflf8ybcAw=",
                Origin: "developer.mpesa.vm.co.mz"
            }
        })
        // handle success
        .then(function(response){
           
        })
        // handle error
        .catch(function(error){
            return(`${error.response.statusText} Status: ${error.response.status}`)
        }) */

