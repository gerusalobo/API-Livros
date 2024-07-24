const Livro = require('../models/livro');
const { ObjectId } = require('mongoose').Types;

exports.getLivros = async (req, res) => {
  const { autor, editora, nome, minPaginas, start_at, limit } = req.query;
  const filters = {};

  if (autor) filters.autor = new RegExp(autor, 'i');
  if (editora) filters.editora = new RegExp(editora, 'i');
  if (nome) filters.nome = new RegExp(nome, 'i');
  if (minPaginas) filters.paginas = { $gte: parseInt(minPaginas, 10) };

  const startAt = parseInt(start_at, 10) || 0;
  const limitVal = Math.min(parseInt(limit, 10) || 1000, 1000);

  try {
    const livros = await Livro.find(filters).skip(startAt).limit(limitVal);
    res.json(livros);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getLivroById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'ID inválido' });
    }
    const livro = await Livro.findById(id);
    if (!livro) {
      return res.status(404).send({ error: 'Livro não encontrado' });
    }
    res.send(livro);
  } catch (error) {
    res.status(500).send({ error: 'Erro ao buscar o livro' });
  }
};

exports.createLivro = async (req, res) => {
  try {
    const livro = new Livro(req.body);
    await livro.save();
    res.status(201).json(livro);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateLivro = async (req, res) => {
  try {
    const livro = await Livro.findByIdAndUpdate(new ObjectId(req.params.id), req.body, { new: true, runValidators: true });
    if (!livro) {
      return res.status(404).send('Livro não encontrado');
    }
    res.json(livro);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteLivro = async (req, res) => {
  try {
    const livro = await Livro.findByIdAndDelete(new ObjectId(req.params.id));
    if (!livro) {
      return res.status(404).send('Livro não encontrado');
    }
    res.send('Livro deletado');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
