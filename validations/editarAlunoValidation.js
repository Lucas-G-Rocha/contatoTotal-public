const { check } = require('express-validator');


module.exports.editarAlunoValidation = [
    check('inputObject.nome').optional({ checkFalsy: true }).trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome deve conter apenas letras')
        .escape(),

    check('inputObject.email').optional({checkFalsy: true}).trim().toLowerCase()
        .isEmail().withMessage('Email deve ser válido'),

    check('inputObject.dataDeNascimento').optional({ checkFalsy: true }).trim()
        .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/).withMessage('Data de nascimento deve estar nesse formato: "DD/MM/YYYY" e ser uma data valida')
        .escape(),

    check('inputObject.telefone').optional({ checkFalsy: true }).trim()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Telefone pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Telefone não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Telefone não pode ter menos que 9 caracteres')
        .escape(),

    check('inputObject.whatsapp').optional({ checkFalsy: true }).trim()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Whatsapp pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Whatsapp não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Whatsapp não pode ter menos que 9 caracteres')
        .escape(),

    check('inputObject.nomeResponsavel').optional({ checkFalsy: true }).trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome do responsavel deve conter apenas letras')
        .escape(),

    check('inputObject.telefoneResponsavel').optional({ checkFalsy: true }).trim()

        .matches(/^[\d\s\(\)-]*$/).withMessage('Telefone do responsável pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Telefone do responsável não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Telefone do responsável não pode ter menos que 9 caracteres')
        .escape(),

    check('inputObject.parentescoResponsavel').optional({ checkFalsy: true }).trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Parentesco do responsável deve conter apenas letras')
        .escape(),

    check('inputObject.nomeContatoEmergencia').optional({ checkFalsy: true }).trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome do contato de emergencia deve conter apenas letras')
        .escape(),

    check('inputObject.telefoneContatoEmergencia').optional({ checkFalsy: true }).trim()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Telefone do contato de emergencia pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Telefone do contato de emergencia não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Telefone do contato de emergencia não pode ter menos que 9 caracteres')
        .escape(),

    check('inputObject.parentescoContatoEmergencia').optional({ checkFalsy: true }).trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Parentesco do contato de emergencia deve conter apenas letras')
        .escape(),

    check('inputObject.problemaDeSaude').optional({ checkFalsy: true }).trim()
        .escape()
]