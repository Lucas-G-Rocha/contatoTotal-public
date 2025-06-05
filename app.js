const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');

const { isLogged, isNotLogged, isAdmin } = require('./middlewares/authRequired');
const { login_post, cadastrarAluno_post, cadastrarAula_post, atualizarDados_patch, deleteAluno_delete, editarAluno_patch, atualizarSituacao_patch, alterarUsuario_patch, alterarSenha_patch, esqueciASenha_code_post, esqueciASenha_verification_post, adicionarPagamento_post } = require('./controllers/authControllers');

const { validarEmail_post, reenviarCodigo_post } = require('./controllers/emailControllers');

const { loginValidations } = require('./validations/loginValidation');
const { atualizarDadosValidation } = require('./validations/atualizarDadosValidation');
const { cadastrarAlunoValidation } = require('./validations/cadastrarAlunoValidation');
const { cadastrarAulaValidation } = require('./validations/cadastrarAulaValidation');
const { editarAlunoValidation } = require('./validations/editarAlunoValidation');
const { atdAlunoValidation } = require('./validations/atdAlunoValidation')
const { alterarUsuarioValidation } = require('./validations/alterarUsuarioValidation');
const { alterarSenhaValidation } = require('./validations/alterarSenhaValidation');
const { esqueciASenhaValidation } = require('./validations/esqueciASenhaValidation');
const { validarCampos } = require('./middlewares/sanitize');
const { perfilShown, adminPerfilShown } = require('./services/perfilServices');
const { sendUserDataToClient, sendPagamentoDataToClient, enviarAlunosParaAdmin_exibirAlunos, enviarDadosDoAlunoParaAdmin_removerAluno, enviarDadosDoAlunoParaAdmin_editarAluno,
sendEmailDataToClient, exibirPagamentos_admin
 } = require('./services/enviarDados');

const Aula = require('./models/aula');
const User = require('./models/user');


const dotenv = require('dotenv');
dotenv.config()

const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine({
    partialsDir: path.join(__dirname, './views/partials'),
    layoutsDir: path.join(__dirname, './views/layout'),
    defaultLayout: 'main',
    helpers: {
        corrigirData: (data) => {
            if(data.includes('&#x2F;')){
                data = data.replaceAll('&#x2F;', '%2F');
            }
            return encodeURIComponent(data);
        },
        adaptarNumeroParaLink: (whatsapp) => {
            return whatsapp.replace(/[\s()-]/g, '');
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());



//Rotas
app.get('/', isLogged, async (req, res) => {
    perfilShown(req, res);
})
app.get('/validarEmail', isLogged, async (req, res) => {
    sendEmailDataToClient(req, res);
})
app.get('/verPagamento/:nomeCompleto/:dataDeNascimento/:turma/:turno/:graduacao', isAdmin, async (req, res) => {
    exibirPagamentos_admin(req, res);
})
app.get('/admin', isLogged, isAdmin, async (req, res) => {
    adminPerfilShown(req, res);
})

app.get('/login', isNotLogged, (req, res) => {

    res.render('login', {
        title: "Login",
        cssPath: '/css/login.css',
        isLogged: false,
        isLoginPage: true
    });

})

app.get('/logout', isLogged, (req, res) => {

    res.cookie('jwt', '', { maxAge: 0, httpOnly: true });
    res.redirect('/login');

})
app.get('/cadastrarAluno', isLogged, isAdmin, async (req, res) => {

    const aulas = await Aula.find({}).lean();
    let turmas = aulas.map(turma => turma.nome);
    console.log(turmas);
    res.render('cadastrarAluno', {
        title: "Cadastrar Aluno",
        cssPath: '/css/cadastrarAluno.css',
        isLogged: true,
        turma: turmas
    })

})
app.get('/cadastrarAula', isLogged, isAdmin, (req, res) => {

    res.render('cadastrarAula', {
        title: "Cadastrar Aula",
        cssPath: '/css/cadastrarAula.css',
        isLogged: true
    })

})
app.get('/atualizarDados', isLogged, (req, res) => {
    sendUserDataToClient(req, res);
})
app.get('/pagamentos', isLogged, (req, res) => {
    sendPagamentoDataToClient(req, res);
})

app.get('/gerarBoletos', isLogged, isAdmin, (req, res) => {
    res.render('gerarBoletos', {
        title: "Gerar Boletos",
        cssPath: '/css/gerarBoleto.css',
        isLogged: true
    })
})

app.get('/exibirTodosOsAlunos', isLogged, isAdmin, (req, res) => {
    enviarAlunosParaAdmin_exibirAlunos(req, res);
})

app.get('/removerAluno/:nomeCompleto/:dataDeNascimento/:turma/:turno/:graduacao', isLogged, isAdmin, async (req, res) => {
    enviarDadosDoAlunoParaAdmin_removerAluno(req, res);
});
app.get('/editarAluno/:nomeCompleto/:dataDeNascimento/:turma/:turno/:graduacao', isLogged, isAdmin, async (req, res) => {
    enviarDadosDoAlunoParaAdmin_editarAluno(req, res);
})
app.get('/alterarUsuario', isLogged, (req, res) => {
    res.render('alterarUsuario', {
            title: "Alterar Usuario",
            cssPath: '/css/alterarUsuario.css',
            isLogged: true
    })
})
app.get('/alterarSenha', isLogged, (req, res) => {
    res.render('alterarSenha', {
        title: "Alterar Senha",
        cssPath: '/css/alterarSenha.css',
        isLogged: true
    })
});
app.get('/esqueceuASenha', (req, res) => {
    res.render('esqueceuASenha', {
        title: "Esqueceu a Senha",
        cssPath: '/css/esqueceuASenha.css'
    })
});
app.post('/login', isNotLogged, [...loginValidations, validarCampos], async (req, res) => {

    login_post(req, res);

})
app.post('/adicionarPagamentoRota', isAdmin, async (req, res) => {
    adicionarPagamento_post(req, res);
});

app.post('/validarEmail', isLogged, (req, res) => {
    validarEmail_post(req, res);
})

app.post('/cadastrarAluno', isLogged, isAdmin, [...cadastrarAlunoValidation, validarCampos], (req, res) => {
try {
    cadastrarAluno_post(req, res);
    
} catch (error) {
    console.log(error.message);
}

})

app.post('/cadastrarAula', isLogged, isAdmin, [...cadastrarAulaValidation, validarCampos], (req, res) => {
    cadastrarAula_post(req, res);


})
app.post('/reenviarCodigo', isLogged, (req, res) => {
    reenviarCodigo_post(req, res);
})
app.post('/esqueciASenhaCode', [...esqueciASenhaValidation, validarCampos], (req, res) => {
    esqueciASenha_code_post(req, res);
})
app.post('/esqueciASenhaVerification', [...esqueciASenhaValidation, validarCampos], (req, res) => {
    esqueciASenha_verification_post(req, res);
})
app.patch('/atualizarDados', isLogged, [...atualizarDadosValidation, validarCampos], async (req, res) => {
    atualizarDados_patch(req, res)
})
app.patch('/editarAluno', isLogged, [...editarAlunoValidation, validarCampos], async (req, res) => {
    editarAluno_patch(req, res)
})
app.patch('/alterarUsuario', isLogged, [...alterarUsuarioValidation, validarCampos], (req, res) => {
    alterarUsuario_patch(req, res);
})
app.patch('/alterarSenha', isLogged, [...alterarSenhaValidation, validarCampos], (req, res) => {
    alterarSenha_patch(req, res);
})

app.delete('/removerAluno', isLogged, isAdmin, (req, res) => {
    deleteAluno_delete(req, res);
})

app.patch('/atualizarSituacao', isLogged, isAdmin,[...atdAlunoValidation, validarCampos] ,(req, res) => {
    atualizarSituacao_patch(req, res);
})

//------
const port = 5500
mongoose.connect(process.env.MONGO_URI).then(result => {
    app.listen(process.env.PORT || port, () => console.log("Connected to " + port));
}).catch(err => console.log("error: " + err));