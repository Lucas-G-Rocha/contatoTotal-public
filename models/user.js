const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    usuario: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    senha: {
        type: String,
        required: true,
        select: false,
        minlenght: 8,
        trim: true
    },
    emailData: {
        email: {
            type: String,
            required: false,
            unique: false
        },
        isEmailValid: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    turno: {
        type: String,
        required: true,
        enum: ['manhã', 'tarde', 'noite']
    },
    vencimento: {
        type: Number,
        required: true
    },
    turma: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Aula',
        trim: true
    },
    dataDeNascimento: {
        type: String,
        required: true,
        trim: true
    },
    telefone: {
        type: String,
        trim: true,
    },
    whatsapp: {
        type: String,
        trim: false
    },
    nomeCompleto: {
        type: String,
        trim: true,
        required: true
    },
    situacao: {
        type: String,
        required: true,
        trim: true,
        enum: ['ativo', 'trancado', 'desativado'],
        default: 'ativo'
    },
    valorMensalidade: {
        type: Number,
        required: true,
        default: 60.00
    },
    problemaDeSaude: {
        type: String,
        required: false,
        default: ''
    },
    contatoEmergencia: {
        nome: {
            type: String,
            required: false,
            default: ''
        },
        telefone: {
            type: String,
            required: false,
            default: ''
        },
        parentesco: {
            type: String,
            required: false,
            default: ''
        }
    },
    genero: {
        type: String,
        required: true,
        enum: ['masculino', 'feminino']
    },
    graduacao: {
        type: String,
        required: true,
        default: 'branco',
        enum: ['branco', 'amarelo', 'amarelo-branco', 'verde', 'verde-branco', 'azul', 'azul-branco', 'marrom','marrom-branco', 'vermelho', 'vermelho-branco', 'preto', 'preto-branco']
    },
    responsavelFinanceiro: {
        nome: {
            type: String,
            required: false
        },
        telefone: {
            type: String,
            required: false
        },
        parentesco: {
            type: String,
            required: false,
            default: ''
        }
    }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });
userSchema.path('createdAt').immutable(true);

userSchema.pre('save', function (next) {
    this.senha = bcrypt.hashSync(this.senha, 10);
    next();
});

userSchema.statics.login = async function (usuario, senha) {
    const user = await this.findOne({ usuario: usuario }).select('+senha').lean();
    if (user) {
        const itMatchs = await bcrypt.compare(senha, user.senha)
        if (itMatchs) {
            return user;
        } else {
            return null;
        }
    } else {
        return null;
    }
}


const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
