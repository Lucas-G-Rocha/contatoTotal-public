const { check } = require('express-validator');

module.exports.alterarSenhaValidation = [
    check('usuario').trim()
    .notEmpty().withMessage('Usuario não pode estar vazio')
    .isAlphanumeric().withMessage('Usuario pode ter apenas letras e números')
    .escape(),

    check('senhaAtual').trim()
    .notEmpty().withMessage('Senha Atual não pode estar vazia')
    .matches(/^[a-zA-Z0-9_ @.áâãàéêíóôõúç]*$/).withMessage('Os caracteres especiais permitidos em senha atual são: . @ _ letras acentuadas e espaço').isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres')
    .escape(),

    check('novaSenha').trim()
    .notEmpty().withMessage('Nova Senha não pode estar vazia')
    .matches(/^[a-zA-Z0-9_ @.áâãàéêíóôõúç]*$/).withMessage('Os caracteres especiais permitidos em nova senha são: . @ _ letras acentuadas e espaço').isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres')
    .escape()
]