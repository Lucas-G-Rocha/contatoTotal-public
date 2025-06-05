const User = require('../models/user')
const Aula = require('../models/aula');
const { isAdmin } = require('../middlewares/authRequired');

module.exports.perfilShown = async (req, res) => {
    if (req.userID) {
        
        const aluno = await User.findOne({ _id: req.userID });
        console.log(aluno);
        const turma = await Aula.findOne({ _id: aluno.turma });


        if (!aluno) return res.status(404).send('User not found');
        if(aluno.role === 'admin') return res.redirect('/admin');
        res.render('inicio', {
            title: "Perfil",
            cssPath: '/css/inicio.css',
            isLogged: true,

            situacao: aluno.situacao,
            nomeCompleto: aluno.nomeCompleto,
            //MENSALIDADES PENDENTES AQUI
            graduacao: aluno.graduacao,
            turma: turma.nome,
            turno: aluno.turno,
            valorMensalidade: aluno.valorMensalidade,
            vencimento: aluno.vencimento,
            email: aluno.emailData.email,
            telefone: aluno.telefone,
            whatsapp: aluno.whatsapp,
            dataDeNascimento: aluno.dataDeNascimento,
            genero: aluno.genero,
            responsavelFinanceiro: aluno.responsavelFinanceiro,
            contatoEmergencia: aluno.contatoEmergencia,
            problemaDeSaude: aluno.problemaDeSaude,

            emailValido: aluno.emailData.isEmailValid
        });
    } else {
        
        return res.status(404).send('User id not exists');
    }
}


module.exports.adminPerfilShown = (req, res) => {
    console.log(req.userID);
    res.render('adminPerfil', {
        title: "Admin Perfil",
            cssPath: '/css/adminPerfil.css',
            isLogged: true,
            isAdmin: true
    });
};

