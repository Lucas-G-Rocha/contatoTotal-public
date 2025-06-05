const { check } = require('express-validator')

module.exports.cadastrarAulaValidation = [
    check('nome').trim().toLowerCase()
        .notEmpty().withMessage('Nome da aula não pode estar vazio')
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Nome da aula só pode conter letras')
        .escape(),

    check('dia').trim().toLowerCase()
        .notEmpty().withMessage('Deve haver pelo menos um dia preenchido')
        .custom(dias => {

            const diasValidos = ['segunda', 'terça', 'quarta', 'quinta', 'sexta'];
            if (!Array.isArray(dias) || dias.some(dia => !diasValidos.includes(dia))) {
                throw new Error('Dias inválidos fornecidos');
            }
            return true;
        })
        .escape(),

    check('horario').trim().toLowerCase()
    .notEmpty().withMessage('Deve haver pelo menos um horário preenchido')
    .custom(horarios => {
        const horariosValidos = [
            '07:30 - 09:00',
            '09:00 - 10:30',
            '14:30 - 16:00',
            '16:00 - 17:30',
            '17:30 - 19:00',
            '18:00 - 19:00',
            '19:00 - 20:30',
            '20:30 - 22:00'
        ];
        if (!Array.isArray(horarios) || horarios.some(horario => !horariosValidos.includes(horario))) {
            throw new Error('Horarios inválidos fornecidos');
        }
        return true;
    })
    .escape()
]