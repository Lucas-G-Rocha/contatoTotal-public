const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pagamentoSchema = new Schema({
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Pago', 'A pagar', 'Vencido']
    },
    metodoDePagamento:{
        type: String,
        required: true,
        enum: ['espécie', 'pix', 'credito', 'debito', '']
    },
    dataDeVencimento: {
        type: Date,
        required: false
    },
    dataDePagamento: {
        type: Date,
        required: true,
        default: null
    },
    mes: {
        type: String,
        required: true
    },
    transacaoID: {
        type: String,
        required: false,
        default: null
    },
    descricao: {
        type: String,
        required: false
    },
    linkMercadoPago: {
        type: String,
        required: false
    },
    historicoStatus: [
        {
            status: {type: String},
            data: {type: Date}
        }
    ]
}, { timestamps: { createdAt: 'createdAt', updatedAt: false }})
pagamentoSchema.path('createdAt').immutable(true);



const Pagamento = mongoose.model('Pagamento', pagamentoSchema, 'pagamentos');
module.exports = Pagamento;