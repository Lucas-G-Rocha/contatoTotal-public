const Aula = require('../models/aula');
const User = require('../models/user');
const Code = require('../models/code');
const Pagamento = require('../models/pagamento');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

module.exports.login_post = async (req, res) => {
    const { usuario, senha } = req.body;
    try {

        const user = await User.login(usuario, senha);
        if (user) {
            const userID = user._id;

            const token = jwt.sign({ userID }, process.env.SECRET_KEY, { expiresIn: 3600 });
            if (token) {
                res.cookie('jwt', token, { maxAge: 3600 * 1000, secure: false, httpOnly: true });
                res.redirect('/');

            } else {
                throw new Error('Erro ao criar o token!')
            }
        } else {
            throw new Error('Usuario ou senha Incorretos')
        }
    } catch (err) {

        // console.log(err.message);
        res.status(400).json({ authError: err.message });
    }
}

module.exports.cadastrarAluno_post = async (req, res) => {
    const aluno = req.body;
    try {
        // console.log(aluno);
        const dataDeNascimentoPSenha = aluno.dataDeNascimento.replace(/&#x2F;/g, '');
        aluno.senha = dataDeNascimentoPSenha;
        // console.log(aluno.senha)

        const dataAtual = new Date();
        const ano = String(dataAtual.getFullYear());
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const horas = String(dataAtual.getHours()).padStart(2, '0');
        const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
        const segundos = String(dataAtual.getSeconds()).padStart(2, '0');
        aluno.usuario = `${ano}${mes}${dia}${horas}${minutos}${segundos}`;
        // console.log(aluno.usuario);
        // console.log(aluno);

        if (Object.keys(aluno).length >= 2) {
            const alunoExists = await encontrarAluno(aluno.usuario);
            if (!alunoExists) {
                // const emailExists = await User.findOne({ "emailData.email": aluno.email });
                // if (!emailExists) {
                    const aulaExists = await encontrarAula(aluno.turma);
                    if (aulaExists) {
                        aluno.turma = aulaExists._id;
                        
                        const user = new User({
                            usuario: aluno.usuario,
                            senha: aluno.senha,
                            emailData: {
                                email: aluno.email,
                                isEmailValid: false
                            },
                            turno: aluno.turno,
                            genero: aluno.genero,
                            vencimento: aluno.vencimento,
                            turma: aluno.turma,
                            dataDeNascimento: aluno.dataDeNascimento,
                            telefone: aluno.telefone,
                            whatsapp: aluno.whatsapp,
                            graduacao: aluno.graduacao,
                            nomeCompleto: aluno.nomeCompleto,
                            valorMensalidade: aluno.valorMensalidade,
                            problemaDeSaude: aluno.problemaDeSaude,
                            contatoEmergencia: {
                                nome: aluno.nomeContatoEmergencia,
                                telefone: aluno.telefoneContatoEmergencia,
                                parentesco: aluno.parentescoContatoEmergencia
                            },
                            responsavelFinanceiro: {
                                nome: aluno.nomeResponsavelFinanceiro,
                                telefone: aluno.telefoneResponsavelFinanceiro,
                                parentesco: aluno.parentescoResponsavelFinanceiro
                            }
                        })
                        user.save()
                            .then(novoAluno => {
                                // console.log(aulaExists);
                                let enviarAluno = novoAluno.toObject();
                                enviarAluno.turma = aulaExists.nome;
                                // console.log(enviarAluno)
                                res.status(200).json({ isCreated: true, novoAluno: enviarAluno });
                            })
                            .catch(err => {
                                res.status(500).json({ isCreated: false, erro: "Erro ao criar aluno", erroMessage: err.message });
                            })
                    } else {
                        throw new Error('Essa turma não existe');
                    }
                // } else {
                //     throw new Error('Esse email já existe');
                // }
            } else {
                throw new Error('Esse usuario já existe');
            }
        } else {
            throw new Error('Os dados não foram enviados');
        }

    } catch (err) {
        res.status(500).json({ cadastrarAlunoError: err.message });
    }
}

module.exports.cadastrarAula_post = async (req, res) => {
    const aula = req.body;
    // console.log(JSON.stringify(aula, null, 2));
    try {
        if (Object.keys(aula).length === 3) {
            const aulaExists = await encontrarAula(aula.nome);
            if (!aulaExists) {
                const horarioClient = aula.horario;
                const diaClient = aula.dia;
                let horarioIsDisponivel = true;

                const aulaDocument = await Aula.find({ dia: { $in: diaClient } });
                console.log(JSON.stringify(aulaDocument, null, 2));
                if (aulaDocument) {
                    const diaHorarioMongo = aulaDocument.map(document => ({
                        dia: document.dia, horario: document.horario
                    }));
                    console.log(diaHorarioMongo);
                    for (let i = 0; i < diaHorarioMongo.length; i++) {
                        let diaHorario = diaHorarioMongo[i];
                        if (diaClient.some(dia => diaHorario.dia.includes(dia))) {
                            if (horarioClient.some(horario => diaHorario.horario.includes(horario))) {
                                const horarioIndisponivel = horarioClient.filter(horario => diaHorario.horario.includes(horario));
                                horarioIsDisponivel = false;
                                throw new Error(`Os seguintes horários não estão disponíveis: ${horarioIndisponivel.join(" / ")}`);
                            } else {
                                horarioIsDisponivel = true;
                            }
                        }
                    }


                }

                const novaAula = new Aula({
                    nome: aula.nome,
                    horario: aula.horario,
                    dia: aula.dia
                })
                novaAula.save()
                    .then(novaAula => {
                        // console.log(aulaExists);
                        let enviarAula = novaAula.toObject();
                        // console.log(enviarAula);
                        res.status(200).json({ isCreated: true, novaAula: enviarAula });
                    })
                    .catch((err) => {
                        res.status(400).json({ isCreated: false, erro: err.message });
                    })
            } else {
                throw new Error('Aula já existe');
            }
        } else {
            throw new Error('Os dados não foram enviados corretamente');
        }
    } catch (err) {
        res.status(400).json({ cadastrarAulaCatchError: err.message });
    }
}

module.exports.deleteAluno_delete = async (req, res) => {
    let { nomeCompleto, dataDeNascimento, turma, turno, graduacao } = req.body;
    try {
        if (dataDeNascimento.includes('/')) {
            dataDeNascimento = dataDeNascimento.replaceAll('/', '&#x2F;');
        }
        if (dataDeNascimento.includes('%2F')) {
            dataDeNascimento = dataDeNascimento.replaceAll('%2F', '&#x2F;');
        }
        if (turma.includes('%20')) {
            turma = turma.replaceAll('%20', ' ');
        }
        if (graduacao.includes('%20')) {
            graduacao = graduacao.replaceAll('%20', ' ');
        }
        if (nomeCompleto.includes('%20')) {
            nomeCompleto = nomeCompleto.replaceAll('%20', ' ');
        }
        const aula = await Aula.findOne({ nome: turma }).lean();
        // console.log(aula);
        if (aula) {
            const turmaID = aula._id;
            const aluno = await User.findOne({ nomeCompleto: nomeCompleto, dataDeNascimento: dataDeNascimento, turma: turmaID, turno: turno, graduacao: graduacao }).lean();
            console.log(nomeCompleto, dataDeNascimento, turmaID, turno, graduacao); 
            console.log(aluno);
            if (aluno) {
                if (aluno.role === 'user') {
                    const isDeleted = await User.deleteOne({ _id: aluno._id }).lean();
                    // console.log(isDeleted);
                    if (isDeleted.deletedCount > 0) {
                        res.status(200).json({ status: true, message: 'Aluno deletado com sucesso!' });
                    } else {
                        res.status(400).json({ status: false, message: "Erro ao deletar aluno" })
                    }
                } else {
                    throw new Error('Não é possivel deletar um admin');
                }
            } else {
                throw new Error('Não foi possivel encontrar o aluno');
            }
        } else {
            throw new Error('Essa aula não existe');
        }

    } catch (err) {
        res.status(400).json({ deleteErro: err.message });
    }
}

module.exports.deleteAula_delete = (req, res) => {

}

module.exports.atualizarDados_patch = async (req, res) => {
    const updateAluno = req.body

    try {

        if (updateAluno) {
            const aluno = await User.findById(req.userID);
            if (aluno) {
                const emailExists = await User.findOne({ "emailData.email": updateAluno.email });
                if (!emailExists || aluno._id.toString() === emailExists._id.toString()) {

                    const updateData = atualizarDadosVerify(updateAluno, aluno);
                    const user = await User.updateOne({ _id: aluno._id }, {
                        $set: {
                            nomeCompleto: updateData.nome,
                            emailData: {
                                email: updateData.email
                            },
                            dataDeNascimento: updateData.dataDeNascimento,
                            telefone: updateData.telefone,
                            whatsapp: updateData.whatsapp,
                            responsavelFinanceiro: {
                                nome: updateData.nomeResponsavel,
                                telefone: updateData.telefoneResponsavel,
                                parentesco: updateData.parentescoResponsavel
                            },
                            contatoEmergencia: {
                                nome: updateData.nomeContatoEmergencia,
                                telefone: updateData.telefoneContatoEmergencia,
                                parentesco: updateData.parentescoContatoEmergencia
                            },
                            problemaDeSaude: updateData.problemaDeSaude
                        }
                    })
                    if (user.modifiedCount > 0) {
                        res.status(200).json({ resposta: 'Atualizado com Sucesso' });
                    } else {
                        throw new Error('Nenhum dado novo foi fornecido. Altere pelo menos um campo para atualizar as informações.');
                    }
                } else {
                    throw new Error('Esse email já existe');
                }
            } else {
                throw new Error('Aluno não encontrado');
            }
        } else {
            throw new Error('Dados não foram enviados corretamente');
        }
    } catch (err) {
        res.status(500).json({ updateError: err.message });
    }
}
module.exports.editarAluno_patch = async (req, res) => {
    const { inputObject, objectParam } = req.body;
    const updateAluno = inputObject;
    console.log('entrou');
    try {
        objectParam.dataDeNascimento = decodeURIComponent(objectParam.dataDeNascimento);
        if (objectParam.dataDeNascimento.includes('/')) {
            objectParam.dataDeNascimento = objectParam.dataDeNascimento.replaceAll('/', '&#x2F;');
        }
        objectParam.turma = decodeURIComponent(objectParam.turma);
        objectParam.graduacao = decodeURIComponent(objectParam.graduacao);
        objectParam.nomeCompleto = decodeURIComponent(objectParam.nomeCompleto);
        console.log(objectParam)
        if (updateAluno) {

            const aula = await Aula.findOne({ nome: objectParam.turma });
            if (aula) {
                objectParam.turmaID = aula._id;
                const aluno = await User.findOne({
                    nomeCompleto: objectParam.nomeCompleto,
                    dataDeNascimento: objectParam.dataDeNascimento,
                    turno: objectParam.turno,
                    graduacao: objectParam.graduacao,
                    turma: objectParam.turmaID
                });
                if (aluno) {
                    // console.log("aluno: " + aluno.emailData.email);
                    // console.log("alunoID: " + aluno._id);
                    const emailExists = await User.findOne({ "emailData.email": inputObject.email });
                    // console.log("Email: " + emailExists.emailData.email)
                    // console.log("EmailID: " + emailExists._id)
                    if (!emailExists || aluno._id.toString() === emailExists._id.toString()) {
                        const updateData = atualizarDadosVerify(updateAluno, aluno);
                        console.log(updateAluno);
                        console.log(updateData);
                        const user = await User.updateOne({ _id: aluno._id }, {
                            $set: {
                                nomeCompleto: updateData.nome,
                                emailData: {
                                    email: updateData.email
                                },
                                dataDeNascimento: updateData.dataDeNascimento,
                                telefone: updateData.telefone,
                                whatsapp: updateData.whatsapp,
                                responsavelFinanceiro: {
                                    nome: updateData.nomeResponsavel,
                                    telefone: updateData.telefoneResponsavel,
                                    parentesco: updateData.parentescoResponsavel
                                },
                                contatoEmergencia: {
                                    nome: updateData.nomeContatoEmergencia,
                                    telefone: updateData.telefoneContatoEmergencia,
                                    parentesco: updateData.parentescoContatoEmergencia
                                },
                                problemaDeSaude: updateData.problemaDeSaude
                            }
                        })
                        if (user.modifiedCount > 0) {
                            res.status(200).json({ status: true, resposta: 'Atualizado com Sucesso' });
                        } else {
                            throw new Error('Nenhum dado novo foi fornecido. Altere pelo menos um campo para atualizar as informações.');
                        }
                    } else {
                        throw new Error('Esse email já existe');
                    }
                } else {
                    throw new Error('Aluno não encontrado');
                }

            } else {
                throw new Error('Erro ao encontrar aula');
            }
        } else {
            throw new Error('Dados não foram enviados corretamente');
        }
    } catch (err) {
        res.status(500).json({ updateError: err.message });
    }
}
module.exports.atualizarSituacao_patch = async (req, res) => {
    const { operacao, alunoInfo } = req.body;

    alunoInfo.dataDeNascimento = alunoInfo.dataDeNascimento.replaceAll('/', '&#x2F;');

    // console.log(operacao);
    // console.log(alunoInfo);
    try {
        const aula = await Aula.findOne({ nome: alunoInfo.turma });
        if (aula) {
            // console.log(aula);
            alunoInfo.turmaID = aula._id;
            // console.log(alunoInfo.turmaID);
            const aluno = await User.findOne({ nomeCompleto: alunoInfo.nomeCompleto, dataDeNascimento: alunoInfo.dataDeNascimento, turma: alunoInfo.turmaID, turno: alunoInfo.turno, graduacao: alunoInfo.graduacao });
            if (aluno) {
                // console.log(aluno);
                const updatedAluno = await User.updateOne({ _id: aluno._id }, {
                    $set: {
                        situacao: operacao
                    }
                });

                console.log(updatedAluno);
                if (updatedAluno.modifiedCount > 0) {
                    res.status(200).json({ status: 'updated', message: 'Atualizado Com Sucesso' })
                } else {
                    res.status(400).json({ status: false, message: "Não é possivel atualizar um dado com o mesmo valor" });
                }
            } else {
                throw new Error('Aluno não encontrado');
            }
        } else {
            throw new Error('Aula não encontrada')
        }

    } catch (err) {
        res.status(400).json({ status: false, erro: err.message });
    }
}
module.exports.alterarUsuario_patch = async (req, res) => {
    const { usuario, novoUsuario, senha } = req.body;
    const userID = req.userID

    try {
        const alunoVerificacao = await User.findOne({ usuario: novoUsuario });

        if (!alunoVerificacao) {
            const aluno = await User.findOne({ _id: userID }).select('+senha');
            if (aluno.role !== 'admin') {
                if (aluno.usuario !== novoUsuario) {
                    if (aluno.usuario === usuario) {
                        const senhaValida = await bcrypt.compare(senha, aluno.senha);

                        if (senhaValida) {
                            const alunoAtualizado = await User.updateOne(
                                { _id: aluno._id }, {
                                $set: {
                                    usuario: novoUsuario
                                }
                            }
                            );
                            if (alunoAtualizado.modifiedCount > 0) {
                                res.status(200).json({ status: true, message: 'Usuario Atualizado' });
                            } else {
                                throw new Error("Ocorreu um erro ao atualizar o Usuario");
                            }
                        } else {
                            throw new Error("Usuario Atual ou Senha incorretos");
                        }
                    } else {
                        throw new Error("Usuario Atual ou Senha incorretos");
                    }
                } else {
                    throw new Error("O novo nome de usuário deve ser diferente do atual.");
                }
            } else {
                throw new Error("Não é possivel alterar o usuario de um administrador");
            }
        } else {
            throw new Error("Esse nome de usuário já existe");
        }
    } catch (err) {
        res.status(400).json({ status: false, erro: err.message });
    }
}
module.exports.alterarSenha_patch = async (req, res) => {
    const { usuario, senhaAtual, novaSenha } = req.body;
    const userID = req.userID;
    const senhaCriptografada = bcrypt.hashSync(novaSenha, 10);
    try {
        if (isBcryptHash(senhaCriptografada)) {
            const aluno = await User.findOne({ _id: userID }).select('+senha');
            if (aluno) {
                if (aluno.usuario === usuario) {
                    const senhaCorreta = await bcrypt.compare(senhaAtual, aluno.senha);
                    if (senhaCorreta) {
                        if (senhaAtual !== novaSenha) {
                            const updatedAluno = await User.updateOne({ _id: aluno._id }, {
                                $set: {
                                    senha: senhaCriptografada
                                }
                            })
                            if (updatedAluno.modifiedCount > 0) {
                                res.status(200).json({ status: true, message: "Senha alterada com sucesso!" });
                            } else {
                                throw new Error('Ocorreu um erro ao modificar a senha');
                            }
                        } else {
                            throw new Error("Não é possível alterar uma senha para uma igual a da atual");
                        }
                    } else {
                        throw new Error('Usuario ou senha atual incorreta');
                    }
                } else {
                    throw new Error('Usuario ou senha atual incorreta');
                }
            } else {
                throw new Error('Ocorreu um erro ao acessar o banco de dados');
            }
        } else {
            throw new Error('Ocorreu um erro ao salvar a nova senha');
        }
    } catch (err) {
        res.status(400).json({ status: false, erro: err.message });
    }
}

module.exports.adicionarPagamento_post = async (req, res) => {
    const {inputObject, objectParam} = req.body;
    console.log(inputObject);
    try{
        objectParam.turmaID = await transformarTurmaPeloNome(objectParam.turma);
        console.log(objectParam);

        const user = await User.findOne({ nomeCompleto: objectParam.nome, dataDeNascimento: objectParam.dataDeNascimento, turma: objectParam.turmaID, turno: objectParam.turno, graduacao: objectParam.graduacao})

        console.log(user);
        
        if(user){
        const pagamento = await new Pagamento({
            aluno: user._id,
            status: inputObject.status,
            mes: inputObject.mes,
            valor: inputObject.valor,
            metodoDePagamento: inputObject.metodoDePagamento,
            dataDePagamento: inputObject.dataDePagamento
        })
        console.log(pagamento);
        pagamento.save().then((response) => {
            res.send('Criado com sucesso');
        })
        .catch((err) => {
            res.send('Error: ' + err.message);
        })
    }
    }catch(err){
        res.status(400).send("Erro:" + err.message);
    }
}

module.exports.esqueciASenha_code_post = async (req, res) => {

}

module.exports.esqueciASenha_verification_post = async (req, res) => {

}

async function transformarTurmaPeloNome(turma){
    try{
        const turmaInfo = await Aula.findOne({nome: turma})
        if(turmaInfo){
            return turmaInfo._id;
        }else{
            throw new Error('Turma não achada');
        }
    }catch(e){
        res.send(e.message);
    }
}

async function encontrarAluno(usuario) {
    const aluno = await User.findOne({ usuario: usuario });
    return aluno;
}
async function encontrarAula(nomeDaAula) {
    const aula = await Aula.findOne({ nome: nomeDaAula });
    return aula;
}

function atualizarDadosVerify(updateAluno, aluno) {
    const updateData = updateAluno;
    if (!updateAluno.nome) {
        updateData.nome = aluno.nome;
    }
    if (!updateAluno.email) {
        updateData.email = aluno.emailData.email;
    }
    if (!updateAluno.dataDeNascimento) {
        updateData.dataDeNascimento = aluno.dataDeNascimento;
    }
    if (!updateAluno.telefone) {
        updateData.telefone = aluno.telefone;
    }
    if (!updateAluno.whatsapp) {
        updateData.whatsapp = aluno.whatsapp;
    }
    if (!updateAluno.nomeResponsavel) {
        updateData.nomeResponsavel = aluno.responsavelFinanceiro.nome;
    }
    if (!updateAluno.telefoneResponsavel) {
        updateData.telefoneResponsavel = aluno.responsavelFinanceiro.telefone;
    }
    if (!updateAluno.parentescoResponsavel) {
        updateData.parentescoResponsavel = aluno.responsavelFinanceiro.parentesco;
    }
    if (!updateAluno.nomeContatoEmergencia) {
        updateData.nomeContatoEmergencia = aluno.contatoEmergencia.nome;
    }
    if (!updateAluno.telefoneContatoEmergencia) {
        updateData.telefoneContatoEmergencia = aluno.contatoEmergencia.telefone;
    }
    if (!updateAluno.parentescoContatoEmergencia) {
        updateData.parentescoContatoEmergencia = aluno.contatoEmergencia.parentesco;
    }
    if (!updateAluno.problemaDeSaude) {
        updateData.problemaDeSaude = aluno.problemaDeSaude;
    }

    return updateData;
}

function isBcryptHash(hash) {
    const bcryptRegex = /^\$2[aby]\$\d{2}\$.{53}$/;
    return bcryptRegex.test(hash);
}

function generateVerificationCode() {

    return crypto.randomInt(100000, 999999);
}