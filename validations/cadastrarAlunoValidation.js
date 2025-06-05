const { check } = require('express-validator');
const Aula = require('../models/aula');

module.exports.cadastrarAlunoValidation = [
    check('nomeCompleto').trim().toLowerCase()
        .notEmpty().withMessage('Nome não pode estar vazio')
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome deve conter apenas letras')
        .escape(),

    check('email').optional({ checkFalsy: true }).trim().toLowerCase()
        .notEmpty().withMessage('O Email não pode estar vazio')
        .isEmail().withMessage('Esse Email não é válido'),

    check('dataDeNascimento').trim().toLowerCase()
        .notEmpty().withMessage('Data de nascimento não pode estar vazio')
        .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/).withMessage('Data de nascimento deve estar nesse formato: "DD/MM/YYYY"')
        .escape(),


    check('genero').trim().toLowerCase()
        .notEmpty().withMessage('Genero não pode estar vazio')
        .isIn(['masculino', 'feminino']).withMessage('Genero deve ser "masculino" ou "feminino"')
        .escape(),

    check('telefone').trim().toLowerCase()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Telefone pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Telefone não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Telefone não pode ter menos que 9 caracteres')
        .escape(),

    check('whatsapp').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Whatsapp pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Whatsapp não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Whatsapp não pode ter menos que 9 caracteres')
        .escape(),

    check('turma').trim().toLowerCase()
        .notEmpty().withMessage('Turma não pode estar vazia')
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Turma deve conter apenas letras')
        .custom((async (nome) => {
            try {
                const aula = await Aula.findOne({ nome: nome }).lean();
                if (aula) {
                    return true;
                } else {
                    throw new Error('Essa turma não existe');
                }
            } catch (err) {
                throw new Error(err.message);
            }
        }))
        .escape(),

    check('turno').trim().toLowerCase()
        .notEmpty().withMessage('Turno não pode estar vazio')
        .isIn(['manhã', 'tarde', 'noite']).withMessage('Turno deve ser "manhã", "tarde" ou "noite"')
        .escape(),

    check('graduacao').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase()
        .isIn([
            'branco',
            'amarelo',
            'amarelo-branco',
            'verde',
            'verde-branco',
            'azul',
            'azul-branco',
            'marrom',
            'marrom-branco',
            'vermelho',
            'vermelho-branco',
            'preto',
            'preto-branco'
        ]).withMessage('Graduação deve ser uma faixa válida')
        .escape(),

    check('vencimento').trim()
        .notEmpty().withMessage('Vencimento não pode estar vazio')
        .matches(/^\d{1,2}$/).withMessage('Dia do vencimento deve conter apenas numeros e até 2 dígitos')
        .custom((valor) => {
                valor = +valor;
                console.log(valor);
                if(valor > 0 && valor <= 31){
                return true
                }else{
                    throw new Error('Dia do vencimento invalido')
                }
        
        })
        .escape(),

    check('valorMensalidade').trim()
        .notEmpty().withMessage('Valor mensalidade não pode estar vazio')
        .matches(/^\d+(\.\d{1,2})?$/).withMessage('O valor deve conter apenas números e um ponto opcional para decimais (ex: 60 ou 60.00).')
        .custom((valor) => {
            const parsedValue = parseFloat(valor);
            if (parsedValue < 1) {
                throw new Error('O valor deve ser maior que 0.99');
            }

            const formattedValue = +parsedValue;
            console.log(formattedValue);
            return true;
        })
        .escape(),

    check('nomeResponsavelFinanceiro').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome do responsavel deve conter apenas letras')
        .escape(),

    check('telefoneResponsavelFinanceiro').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Telefone do responsável pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Telefone do responsável não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Telefone do responsável não pode ter menos que 9 caracteres')
        .escape(),

    check('parentescoResponsavelFinanceiro').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Parentesco do responsável deve conter apenas letras')
        .escape(),

    check('nomeContatoEmergencia').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome do contato de emergencia deve conter apenas letras')
        .escape(),

    check('telefoneContatoEmergencia').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Telefone do contato de emergencia pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Telefone do contato de emergencia não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Telefone do contato de emergencia não pode ter menos que 9 caracteres')
        .escape(),

    check('parentescoContatoEmergencia').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Parentesco do contato de emergencia deve conter apenas letras')
        .escape(),

    check('problemaDeSaude').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase()
        .escape()
]