const mongoose = require('mongoose');
const { listeners } = require('./user');
const Schema = mongoose.Schema;

const aulaSchema = new Schema({
   nome: {
      type: String,
      required: true,
      unique: true
   },
   dia: {
      type: [String],
      required: true,
      enum: [
         'segunda',
         'terça',
         'quarta',
         'quinta',
         'sexta'
      ]
   },
   horario:{
      type: [String],
      required: true,
      enum: [
         '07:30 - 09:00',
         '09:00 - 10:30',
         '14:30 - 16:00',
         '17:30 - 19:00',
         '19:00 - 20:30',
         '16:00 - 17:30',
         '20:30 - 22:00',
         '18:00 - 19:00'
      ]
   },
   turno:{
      type: [String],
      required: true,
      enum: ['manhã', 'tarde', 'noite']
   }

}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });
aulaSchema.path('createdAt').immutable(true);
aulaSchema.pre('save', function (next) {
   const horarios = this.horario;
   let turno = this.turno;

   console.log('horarios: ', this.horario);

   horarios.forEach(hora => {
       if (hora === '07:30 - 09:00') {
           if (!turno.includes('manhã')) {
               turno.push('manhã');
           }
       }
       if (hora === '09:00 - 10:30') {
           if (!turno.includes('manhã')) {
               turno.push('manhã');
           }
       }
       if (hora === '14:30 - 16:00') {
           if (!turno.includes('tarde')) {
               turno.push('tarde');
           }
       }
       if (hora === '17:30 - 19:00') {
           if (!turno.includes('tarde')) {
               turno.push('tarde');
           }
       }
       if (hora === '16:00 - 17:30') {
           if (!turno.includes('tarde')) {
               turno.push('tarde');
           }
       }
       if (hora === '18:00 - 19:00') {
           if (!turno.includes('noite')) {
               turno.push('noite');
           }
       }
       if (hora === '19:00 - 20:30') {
           if (!turno.includes('noite')) {
               turno.push('noite');
           }
       }
       if (hora === '20:30 - 22:00') {
           if (!turno.includes('noite')) {
               turno.push('noite');
           }
       }
   });

   this.turno = turno;
   next();
});


   const Aula = mongoose.model('Aula', aulaSchema, 'aulas');
   module.exports = Aula;