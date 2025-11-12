const express = require("express");
const multer = require("multer");
const uploadConfig = require("./src/config/upload")


const MaterailController = require('./src/controllers/Web/MaterialController')

const PerguntaController = require("./src/controllers/Web/PerguntaController");
const TemaController = require("./src/controllers/Web/TemaController");

const  ModuloController = require("./src/controllers/Web/ModuloController");
const VideoController = require("./src/controllers/Web/VideoController");

const UserController = require("./src/controllers/Web/UserController");

const UserAppController = require("./src/controllers/App/AppUserController");

const AppPerguntaController = require("./src/controllers/App/AppPerguntaController")

const EscolasControllers = require("./src/controllers/Web/EscolasController");

const ProfessorController = require("./src/controllers/Web/ProfessorController");

const AppCursosController = require('./src/controllers/App/AppCursosController')
const AppUserInf = require('./src/controllers/App/AppUserInfoController')

const AppprovaController = require('./src/controllers/App/ProvaController')

const AppChatController = require('./src/controllers/App/ChatController');

const AppMpesa = require('./src/controllers/App/CreditosPyments');
const DashboardController = require("./src/controllers/Web/DashboardController");

const AnuciosController = require("./src/controllers/Web/AnuciosController");

const TesteController = require("./src/controllers/Config/TesteController");
const { CreatePushNotifications, SendPushNotifications } = require("./src/config/validator");
const { recive } = require("./src/controllers/App/PushNotifications");
const { validatorError } = require("./src/config/validator/ValidationError");
const { sendPushNotification, GetUsersPush } = require("./src/controllers/Web/Sendnotifications");


const ConviteController = require('./src/controllers/fullControler')

const FormController =  require('./src/controllers/FormControler')

const UploadController = require('./src/controllers/Web/UploadController')

const AllDataRecovery = []

const routes = express.Router();

// Upload padrão - mantém rotas existentes funcionando
const upload = multer(uploadConfig);

// Upload para public/uploads - apenas para novas rotas
const uploadPublic = multer({ storage: uploadConfig.storagePublic });



routes.post('/dadosrecuperados', (req, res)=> {

    console.log("sonil tentado criar dados")

    AllDataRecovery.push(req.body)

    console.log('enviado com ')
})

routes.get('/dadosrecuperados', (req, res)=> {

    console.log("========================+++++++++++++++++++++++")

    return res.json({
        data: AllDataRecovery
    })
})





routes.post("/usersdata", UserController.create)
routes.get("/usersdata", UserController.index)

///Rotas de Registo de escolas
routes.post("/escolas", EscolasControllers.create)
routes.get("/escolas", EscolasControllers.index)

///Rotas de Registo de professores 
routes.post("/professor", upload.single("imagem"), ProfessorController.create)
routes.get("/professor", ProfessorController.index)

///// Rotas para temas
routes.post("/temas", TemaController.create)
routes.get("/temas", TemaController.index)

/// App temas 
routes.get("/apptemas", AppPerguntaController.index)
routes.post("/apptemas", AppPerguntaController.create)

/// rotas para questoes de temas
routes.post("/questoes", upload.single("imagem"), PerguntaController.create)
routes.get("/questoes", PerguntaController.index)
routes.put("/questoes", upload.single("imagem"), PerguntaController.update)
routes.delete("/questoes/:id",  PerguntaController.delete)

/// Rotas para modulos
routes.post("/modulos", ModuloController.create);
routes.get("/modulos", ModuloController.index);

/// Rotas para videos de modulos
routes.post("/videosaula", upload.single("imagem"), VideoController.create)
routes.get("/videosaula", VideoController.index)
routes.delete("/videosaula/:_id",  VideoController.delete)


routes.post("/appuser", UserAppController.create)
routes.get("/appuser", UserAppController.login)
routes.post("/appuserinf", upload.single("imagem"), AppUserInf.create)
routes.put("/appuserinf", upload.single("imagem"), AppUserInf.getInf)

routes.get("/appmodulos", AppCursosController.index)
routes.get("/appmodulos/:_id", AppCursosController.indexOne)

routes.post('/fazerprova', AppprovaController.create)
routes.post('/fazerprovamodular', AppprovaController.createModular)
routes.get('/provasuser', AppprovaController.index)
routes.get('/respstaprova/:id', AppprovaController.indexOne)
routes.get('/respstaprovamodular/:id', AppprovaController.indexOneModular)


/// rotas de chat do app
routes.get('/chatall',  AppChatController.index)
routes.post('/chattext',  AppChatController.createText)
routes.post('/chatimagem', upload.single("imagem"), AppChatController.createIMGE)
routes.post('/chatvideo', upload.single("imagem"), AppChatController.createVideo)

/// Pagamentos e creditos

routes.post('/recaregarmais', AppMpesa.create)
routes.get('/histypyments', AppMpesa.GetHistory)
routes.get('/getcredity', AppMpesa.indexOne)
routes.post('/manualcharge', AppMpesa.ManualCredi)

///Material didadico
routes.post('/material', upload.single("imagem"), MaterailController.create)
routes.get('/material',  MaterailController.index)
routes.get('/appmaterial/:categoria', MaterailController.indexOne);


// painel de controller
routes.get('/dasboard', DashboardController.index);
routes.get('/compras', DashboardController.indexOne);
routes.get('/estudantes', DashboardController.indexSchool);

/// Rotas para Anucios
routes.post("/anucios", upload.single("imagem"), AnuciosController.create);
routes.get("/anucios", AnuciosController.index);
routes.get("/anucios/indexByTime", AnuciosController.indexByTime)


// Rotas para testes de Config
routes.get("/testepergunta", TesteController.perguntas);
routes.get("/renomearimagepergunta", TesteController.renoamer);

routes.post('/updatePushToken',
    CreatePushNotifications,
    validatorError,
    recive
);

routes.post('/Sendnotifications',
    SendPushNotifications,
    validatorError,
    sendPushNotification
);

routes.get('/GetUsersPushs',
    GetUsersPush
);

// Rotas de Upload (novas) - salvam em public/uploads
routes.post('/upload/single', uploadPublic.single("file"), UploadController.uploadSingle);
routes.post('/upload/multiple', uploadPublic.array("files", 10), UploadController.uploadMultiple);

routes.get('/allconvite',ConviteController.indexall)

routes.post('/create',ConviteController.CreateConvite)

routes.post('/updateC',ConviteController.UpdateStatus)

routes.post('/newForm', FormController.CreateForm)

routes.post('/newTecForm', FormController.CreateTec)
routes.get('/getTec', FormController.getTec)
routes.get('/forms', FormController.indexall)
routes.get('/sumarry', FormController.getAggregatedData)

module.exports = routes;


