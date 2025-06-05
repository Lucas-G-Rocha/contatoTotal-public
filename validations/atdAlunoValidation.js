const { check } = require('express-validator');

module.exports.atdAlunoValidation = [
    check('operacao').trim()
    .notEmpty().withMessage('Deve ser uma dessas opções: Ativar/Desativar/Trancar')
    .isIn(['ativo', 'desativado', 'trancado']).withMessage('O valor deve ser válido')
    .escape(),

    check('alunoInfo.nomeCompleto').trim()
    .notEmpty().withMessage('Ocorreu um erro ao buscar as informações')
    .escape(),

    check('alunoInfo.turma').trim()
    .notEmpty().withMessage('Ocorreu um erro ao buscar as informações')
    .escape(),
    
    check('alunoInfo.turno').trim()
    .notEmpty().withMessage('Ocorreu um erro ao buscar as informações')
    .escape(),
    
    check('alunoInfo.dataDeNascimento').trim()
    .notEmpty().withMessage('Ocorreu um erro ao buscar as informações')
    .escape(),
    
    check('alunoInfo.graduacao').trim()
    .notEmpty().withMessage('Ocorreu um erro ao buscar as informações')
    .escape()
]