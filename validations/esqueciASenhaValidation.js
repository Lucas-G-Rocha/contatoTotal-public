const { check } = require('express-validator');

module.exports.esqueciASenhaValidation = [
    check('email').trim().toLowerCase()
    .notEmpty().withMessage('O Email não pode estar vazio')
    .isEmail().withMessage('Esse Email não é válido')
]