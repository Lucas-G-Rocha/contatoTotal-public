const { check } = require('express-validator');


module.exports.atualizarDadosValidation = [
    check('nome').optional().trim().toLowerCase()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome deve conter apenas letras')
        .escape(),

    check('email').optional().trim().toLowerCase()
        .isEmail().withMessage('Email deve ser válido'),
        
    check('dataDeNascimento').optional({ checkFalsy: true }).trim()
        .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/).withMessage('Data de nascimento deve estar nesse formato: "DD/MM/YYYY" e ser uma data valida')
        .escape(),

    check('telefone').optional().trim()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Telefone pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Telefone não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Telefone não pode ter menos que 9 caracteres')
        .escape(),

    check('whatsapp').optional().trim()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Whatsapp pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Whatsapp não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Whatsapp não pode ter menos que 9 caracteres')
        .escape(),

    check('nomeResponsavel').optional().trim()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome do responsavel deve conter apenas letras')
        .escape(),

    check('telefoneResponsavel').optional().trim()

        .matches(/^[\d\s\(\)-]*$/).withMessage('Telefone do responsável pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Telefone do responsável não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Telefone do responsável não pode ter menos que 9 caracteres')
        .escape(),

    check('parentescoResponsavel').optional().trim()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Parentesco do responsável deve conter apenas letras')
        .escape(),

    check('nomeContatoEmergencia').optional().trim()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome do contato de emergencia deve conter apenas letras')
        .escape(),

    check('telefoneContatoEmergencia').optional().trim()
        .matches(/^[\d\s\(\)-]*$/).withMessage('Telefone do contato de emergencia pode conter apenas números, espaços, parênteses e hífens')
        .isLength({ max: 18 }).withMessage('Telefone do contato de emergencia não pode ter mais que 17 caracteres')
        .isLength({ min: 9 }).withMessage('Telefone do contato de emergencia não pode ter menos que 9 caracteres')
        .escape(),

    check('parentescoContatoEmergencia').optional().trim()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Parentesco do contato de emergencia deve conter apenas letras')
        .escape(),

    check('problemaDeSaude').optional().trim()
        .escape()
]