const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const codeSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: Number,
        required: true,
        unique: false
    },
    tentativas: {
        type: Number,
        default: 0
    },
    ultimaTentativa: {
        type: Date
        
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    expiresAt: {
        type: Date,
        default: function(){
            return new Date(Date.now() + 600000)
        }
    }

});
codeSchema.path('createdAt').immutable(true);


const Code = new mongoose.model('Code', codeSchema, 'codes');

module.exports = Code;