const { check } = require('express-validator');

module.exports.alterarUsuarioValidation = [

    check('usuario').trim()
    .notEmpty().withMessage('Usuario não pode estar vazio')
    .isAlphanumeric().withMessage('Usuario pode ter apenas letras e números')
    .escape(),

    check('novoUsuario').trim()
    .notEmpty().withMessage('Novo usuario não pode estar vazio')
    .isAlphanumeric().withMessage('Novo usuario pode ter apenas letras e números')
    .escape(),

    check('senha').trim()
    .notEmpty().withMessage('Senha não pode estar vazia')
    .matches(/^[a-zA-Z0-9_ @.áâãàéêíóôõúç]*$/).withMessage('Os caracteres especiais permitidos em senha são: . @ _ letras acentuadas e espaço').isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres')
    .escape()
]