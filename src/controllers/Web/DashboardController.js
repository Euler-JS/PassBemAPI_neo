const HistoricoCreditos = require('../../models/HistoricoCreditos');
const Users = require('../../models/UserApp');
const Estudantes = require('../../models/UserInf');
const Professores = require('../../models/Professor');
const Escolas = require('../../models/Escolas');
const Admin = require('../../models/Admin');

module.exports = {

    async index(req, res){

        let date = new Date();


        date.setDate(date.getDate() - 2);

    

        const Admin = req?.headers?.authorization;



        try{

            const escolas = await Escolas.find({});
            const professor = await Professores.find({})

            const user = await Users.find({});

            const userInfo = await Estudantes.find({});

            const ganho = await HistoricoCreditos.aggregate([
                {
                    $match: { status: true , inscricao:{$gte: date}}
                },
                {
                    $group: {
                        _id: '$true',
                        "totalSales": {
                            $sum: "$valor"
                        }
                    }
                }]);

            const compras = await HistoricoCreditos.find({status:true})
                .populate('user')

            compras.reverse()

            userInfo?.reverse()

            const ganhos = ganho[0]?.totalSales


            return res.json({
                messagem:'Painel de Controler',
                type: "Confirmation",
                statusCode: 200,
                value:{ user: user?.length, ganhos, userInfo, compras, escolas:escolas?.length, professor: professor?.length},
            })


          }catch(error){

            return res.status(500).json({
                messagem:'Painel de Controler',
                type: "Refused",
                error_detalhe:error,
                data:{},
            })

        }  
       

    },

    async indexOne(request, response){


        const user = request.headers?.user




        try{

            const userLogin = await Admin.findById(user)


            if(!userLogin){

                return response.status(401).json({mensage:"Not authenticate"})
            }

            var compras = []

            if(userLogin && userLogin.admin == true){

                compras = await HistoricoCreditos.find({status:true})
                .populate('user')
            }
            else{

                compras = await HistoricoCreditos.find({status:true, authorName:userLogin?.email})
                .populate('user')
            }

            compras.reverse()


            return response.json({
                messagem:'Lista de Compras',
                type: "Confirmation",
                statusCode: 200,
                value:{compras},
            })

        }catch{
            return response.status(500).json({
                messagem:'Lista de Compras',
                type: "Refused",
                error_detalhe:error,
                data:{},
            })
        }
    },

    async chartAnual(request, response){

        const ano = parseInt(request?.query?.ano) || new Date().getFullYear();

        const meses = [
            'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
            'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
        ];

        try {
            const resultado = await HistoricoCreditos.aggregate([
                {
                    $match: {
                        status: true,
                        inscricao: {
                            $gte: new Date(`${ano}-01-01`),
                            $lt:  new Date(`${ano + 1}-01-01`),
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$inscricao' },
                        acumulado: { $sum: '$valor' }
                    }
                }
            ]);

            const data = meses.map((name, i) => {
                const entry = resultado.find(r => r._id === i + 1);
                return { time: name, acumulado: entry ? entry.acumulado : 0 };
            });

            return response.json({ type: 'Confirmation', statusCode: 200, value: data });

        } catch (error) {
            return response.status(500).json({ type: 'Refused', error_detalhe: error });
        }
    },

    async indexSchool(request, response){

        const categoria = request?.query?.categoria;
        const escola = request?.query?.escola;


        let filter = {
            categoria:categoria,
            escola:escola,
        }

        if(!categoria || categoria == 'null' || categoria == 'undefined' || categoria =='Seleccione a categoria'){
            delete filter?.categoria;
        }
        if(!escola || escola == 'null' || escola =='undefined'){
            delete filter?.escola
        }



        try{
            const estudantes = await Estudantes.find(filter)
                .populate('user')

            estudantes.reverse()


            return response.json({
                messagem:'Lista de estudantes',
                type: "Confirmation",
                statusCode: 200,
                value:{estudantes},
            })
            
          }catch(error){
            return response.status(500).json({
                messagem:'Lista de estudantes',
                type: "Refused",
                error_detalhe:error,
                data:{},
            })
        } 
    }
}