const Aula = require('../models/aula');
const User = require('../models/user');
const Code = require('../models/code');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

module.exports.validarEmail_post = async (req, res) => {
    try {
        const aluno = await User.findOne({ _id: req.userID });
        // console.log(aluno);
        if (aluno) {
            const { emailData } = aluno;
            // console.log(emailData);
            if (emailData.email) {
                const emailExistsInCodeModel = await Code.findOne({email: emailData.email});

                if(!emailExistsInCodeModel) {
                let codeExists = false;
                let code;
                let tentativas = 0;
                while (!codeExists && tentativas <= 10) {
                    let codeTest = gerarCodigo();
                    let itExists = await Code.findOne({ email: emailData.email, code: codeTest })
                    if (!itExists) {
                        codeExists = true;
                        code = codeTest;
                        break;
                    }
                    ++tentativas;
                }
                if(tentativas > 10){
                    throw new Error('Numero de tentativas máximo excedido, por favor, tente novamente')
                }
                const saveCode = new Code({
                    email: emailData.email,
                    code: code
                });
                saveCode.save().then((savedCode) => {
                    console.log(savedCode);
                })
                .catch((err) => {
                    console.log(err.message);
                    res.status(400).json({ status: false, message: err.message});
                })

                
                
            }else if(emailExistsInCodeModel.expiresAt < Date.now()){
                let codeExists = false;
                let code;
                let tentativas = 0;
                while (!codeExists && tentativas <= 10) {
                    let codeTest = gerarCodigo();
                    let itExists = await Code.findOne({ email: emailData.email, code: codeTest })
                    if (!itExists) {
                        codeExists = true;
                        code = codeTest;
                        break;
                    }
                    ++tentativas;
                }
                if(tentativas > 10){
                    throw new Error('Numero de tentativas máximo excedido, por favor, tente novamente')
                }

                const updatedCode = await Code.updateOne({email: emailData.email }, { $set: {code: code, expiresAt: Date.now()+600000}})
                console.log(updatedCode);
                if(updatedCode.modifiedCount === 0){
                    throw new Error('Ocorreu um erro na geração de um novo código, por favor, tente novamente');
                }
                console.log("codigo atualizado heh");
                res.status(200).json({status: true, message: 'Seu código expirou mas já o atualizamos, verifique seu email'});
            
            } else if(emailExistsInCodeModel.expiresAt > Date.now()){
                console.log('codigo valido heh')
                res.status(200).json({status: true, message: 'Ainda há um código válido, procure em seu email ou clique em "Reenviar Código"'});
            }
            }
        }


    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
}

module.exports.reenviarCodigo_post = async (req, res) => {
    
}

function gerarCodigo() {
    return crypto.randomInt(100000, 999999);
}