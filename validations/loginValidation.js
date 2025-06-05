const { check } = require('express-validator');

module.exports.loginValidations = [
  check('usuario')
    .trim()
    .notEmpty().withMessage('Usuario Vazio')
    .isAlphanumeric().withMessage('Usuario pode ter apenas letras e números')
    .escape(),

  check('senha')
    .trim()
    .notEmpty().withMessage('Senha Vazia')
    .matches(/^[a-zA-Z0-9_ @.áâãàéêíóôõúç]*$/).withMessage('Os caracteres especiais permitidos em senha são: . @ _ letras acentuadas e espaço').isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres')
    .escape(),
];
