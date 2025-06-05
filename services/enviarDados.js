const User = require('../models/user');
const Aula = require('../models/aula');
const Pagamento = require('../models/pagamento');
const { response } = require('express');

module.exports.sendUserDataToClient = async (req, res) => {
    const userID = req.userID
    try {

        if (userID) {
            const user = await User.findOne({ _id: userID });

            if (user) {
                let {
                    nomeCompleto,
                    dataDeNascimento,
                    telefone,
                    whatsapp,
                    responsavelFinanceiro,
                    contatoEmergencia,
                    problemaDeSaude,
                    emailData
                } = user
                // console.log(emailData);
                const userData = {
                    nomeCompleto,
                    dataDeNascimento,
                    telefone,
                    whatsapp,
                    responsavelFinanceiro,
                    contatoEmergencia,
                    problemaDeSaude,
                    email: emailData.email
                }
                if (userData) {

                    res.render('atualizarDados', {
                        title: "Atualizar Dados",
                        cssPath: '/css/atualizarDados.css',
                        isLogged: true,
                        userData: userData
                    })
                } else {
                    throw new Error('Erro ao buscar dados');
                }
            } else {
                throw new Error('id invalido');
            }
        } else {
            throw new Error('Você deve estar Logado')
        }
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

module.exports.sendPagamentoDataToClient = (req, res) => {
    //Enviar um Array de objetos no res.render e fazer um foreach lá pra exibir todos os boletos

}

module.exports.enviarAlunosParaAdmin_exibirAlunos = async (req, res) => {
    const alunos = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).lean();
    console.log('entrou 3');

    // console.log(alunos);
    if (alunos) {
        await Promise.all(alunos.map(async (aluno) => {

            aluno.createdAt = transformarData(aluno.createdAt);
            aluno.turma = await transformarTurma(aluno.turma);
        }));
        // console.log(alunos);
        res.render('exibirTodosOsAlunos', {
            title: 'Todos os Alunos',
            cssPath: '/css/exibirTodosOsAlunos.css',
            alunos: alunos,
            isLogged: true
        });
    }
}

module.exports.enviarDadosDoAlunoParaAdmin_removerAluno = async (req, res) => {
    let { nomeCompleto, dataDeNascimento, turma, turno, graduacao } = req.params;
    dataDeNascimento = decodeURIComponent(dataDeNascimento);
    if (dataDeNascimento.includes('/')) {
        dataDeNascimento = dataDeNascimento.replaceAll('/', '&#x2F;');
    }
    turma = decodeURIComponent(turma);
    graduacao = decodeURIComponent(graduacao);
    nomeCompleto = decodeURIComponent(nomeCompleto);
    // console.log('1\n')
    console.log(nomeCompleto, dataDeNascimento, turma, turno, graduacao);
    try {
        const aula = await Aula.findOne({ nome: turma });
        console.log('entrou 2')
        if (aula) {
            // console.log('aula: ' + aula);
            const turmaID = aula._id;
            const aluno = await User.findOne({ nomeCompleto: nomeCompleto, dataDeNascimento: dataDeNascimento, turma: turmaID, turno: turno, graduacao: graduacao }).lean();
            // console.log('turmaID: ' + turmaID);
            // console.log('aluno: ' + JSON.stringify(aluno, null, 2))
            if (aluno) {
                aluno.turma = aula.nome;
                aluno.createdAt = transformarData(aluno.createdAt);
                // console.log('turma ' + aluno.turma);
                res.render('removerAluno', {
                    title: 'Remover Aluno',
                    cssPath: '/css/removerAluno.css',
                    isLogged: true,
                    aluno: aluno
                })
            } else {
                res.redirect('/exibirTodosOsAlunos');
            }
        } else {
            res.redirect('/exibirTodosOsAlunos')
        }
    } catch (err) {
        res.status(404).json({ erro: err.message });
    }


}
module.exports.enviarDadosDoAlunoParaAdmin_editarAluno = async (req, res) => {
    let { nomeCompleto, dataDeNascimento, turma, turno, graduacao } = req.params;
    console.log('entrou 4');
    dataDeNascimento = decodeURIComponent(dataDeNascimento);
    if (dataDeNascimento.includes('/')) {
        dataDeNascimento = dataDeNascimento.replaceAll('/', '&#x2F;');
    }
    turma = decodeURIComponent(turma);
    graduacao = decodeURIComponent(graduacao);
    nomeCompleto = decodeURIComponent(nomeCompleto);
    // console.log('1\n')
    console.log(nomeCompleto, dataDeNascimento, turma, turno, graduacao);
    try {
        const aula = await Aula.findOne({ nome: turma });
        if (aula) {
            // console.log('aula: ' + aula);
            const turmaID = aula._id;
            const aluno = await User.findOne({ nomeCompleto: nomeCompleto, dataDeNascimento: dataDeNascimento, turma: turmaID, turno: turno, graduacao: graduacao }).lean();
            // console.log('turmaID: ' + turmaID);
            // console.log('aluno: ' + JSON.stringify(aluno, null, 2))
            if (aluno) {
                aluno.turma = aula.nome;
                aluno.createdAt = transformarData(aluno.createdAt);
                // console.log('turma ' + aluno.turma);
                res.render('editarAluno', {
                    title: 'Editar Aluno',
                    cssPath: '/css/editarAluno.css',
                    isLogged: true,
                    aluno: aluno
                })
            } else {
                res.redirect('/exibirTodosOsAlunos');
            }
        } else {
            res.redirect('/exibirTodosOsAlunos')
        }
    } catch (err) {
        res.status(404).json({ erro: err.message });
    }


}
module.exports.exibirPagamentos_admin = async (req, res) => {
    const userID = req.userID;
    const userInfo = transformarDados(req.params);
    console.log("1");
    try {
        const isAdmin = await User.findOne({ _id: userID });
        if (isAdmin) {
            if (isAdmin.role === 'admin') {
                
                userInfo.turmaID = await transformarTurmaPeloNome(userInfo.turma);
                console.log("2");
                console.log(userInfo);
                const userData = await User.findOne({ nomeCompleto: userInfo.nomeCompleto, dataDeNascimento: userInfo.dataDeNascimento, turma: userInfo.turmaID, turno: userInfo.turno, graduacao: userInfo.graduacao });
                console.log("3"); 
                console.log(userData);  
                if (userData) {
                    console.log("3,3")
                    if (userData.role === 'user') {
                        console.log("3,4");
                        const pagamentos = await Pagamento.find({ aluno: userData._id }).lean();
                        console.log(pagamentos);    
                        console.log("4");
                        if (pagamentos.length > 0) {
                            console.log("5");
                            const pagamentosFormatado = await formatarDataDePagamento(pagamentos);
                            console.log(pagamentosFormatado);
                            
                            res.render('verPagamento', {
                                title: 'Ver Pagamentos',
                                cssPath: '/css/verPagamento.css',
                                isLogged: true,
                                pagamentos: pagamentosFormatado,
                                isNull: false
                            });
                        } else {
                            console.log("6");
                            res.render('verPagamento', {
                                title: 'Ver Pagamentos',
                                cssPath: '/css/verPagamento.css',
                                isLogged: true,
                                pagamentos: pagamentos,
                                isNull: true
                            });
                        }
                    }
                }else{
                    throw new Error("Usuario não encontrado");
                }
            }else{
                throw new Error("Usuario não é um admin");
            }
        }else{
            throw new Error("Usuario não encontrado2")
        }
    } catch (err) {
        res.status(400).send("Ocorreu um erro + \n" + err.message);
    }
}

module.exports.sendEmailDataToClient = async (req, res) => {
    const userID = req.userID
    try {

        if (userID) {
            const user = await User.findOne({ _id: userID });
            if (user) {
                const emailData = user.emailData;
                console.log(emailData)
                if (emailData) {

                    res.render('validarEmail', {
                        title: "Atualizar Dados",
                        cssPath: '/css/validarEmail.css',
                        isLogged: true,
                        emailData: emailData
                    })
                } else {
                    throw new Error('Erro ao buscar dados');
                }
            } else {
                throw new Error('id invalido');
            }
        } else {
            throw new Error('Você deve estar Logado');
        }
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

async function formatarDataDePagamento(pagamentos) {
    // Função para formatar a data
    function formatarData(data) {
        const d = new Date(data);        
        const dia = d.getDate().toString().padStart(2, '0');
        const mes = (d.getMonth() + 1).toString().padStart(2, '0');
        const ano = d.getFullYear();
        
        // Retorna a data formatada no formato desejado
        return `${dia}/${mes}/${ano}`;
    }

    // Percorre o array de pagamentos e altera o campo de data
    for (let pagamento of pagamentos) {
        // Formata a data
        pagamento.dataDePagamento = formatarData(pagamento.dataDePagamento);
    
        // Busca o nomeCompleto do aluno com base no _id
        let usuario = await User.findOne({ _id: pagamento.aluno }).select('nomeCompleto').lean();
    
        // Se encontrar, substitui o ID pelo nomeCompleto
        if (usuario) {
          pagamento.nome = usuario.nomeCompleto;
        }
      }
    
    // Retorna o array com as datas formatadas
    return pagamentos;
}

async function transformarTurma(turmaID) {
    try {
        const turma = await Aula.findOne({ _id: turmaID });
        if (turma) {
            return turma.nome;
        }
    } catch (e) {
        // console.log(e.message);
        res.status(400).json({ erro: e.message });
    }
}
async function transformarTurmaPeloNome(turma){
    try{
        const turmaInfo = await Aula.findOne({nome: turma})
        if(turmaInfo){
            return turmaInfo._id;
        }
    }catch(e){
        res.send(e.message);
    }
}
function transformarDados(objectParam){
    objectParam.dataDeNascimento = decodeURIComponent(objectParam.dataDeNascimento);
        if (objectParam.dataDeNascimento.includes('/')) {
            objectParam.dataDeNascimento = objectParam.dataDeNascimento.replaceAll('/', '&#x2F;');
        }
        objectParam.turma = decodeURIComponent(objectParam.turma);
        objectParam.graduacao = decodeURIComponent(objectParam.graduacao);
        objectParam.nomeCompleto = decodeURIComponent(objectParam.nomeCompleto);
        // console.log(objectParam)
        return objectParam;
}
function transformarData(data) {
    const dataCompleta = new Date(data);
    const dia = dataCompleta.getDate();
    const mes = dataCompleta.getMonth() + 1;
    const ano = dataCompleta.getFullYear();
    const formattedDate = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
    return formattedDate;
}