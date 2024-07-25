const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  genero: {
    type: String,
    required: false,
  },
  paginas: {
    type: Number,
    required: false,
  },
  editora: {
    type: String,
    required: false,
  }
},{ collection: 'bookslist' });

const Livro = mongoose.model('Livro', livroSchema);

module.exports = Livro;
