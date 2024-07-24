const Livro = require('../models/livro');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;
const express = require('express');

//Endpoints

//Lista de Livros
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

//Get Livro by ID
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

//Criar livro
exports.createLivro = async (req, res) => {
    try {
      const livro = new Livro(req.body);
      await livro.save();
      res.status(201).json(livro);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

//Atualizar Livro  
exports.updateLivro = async (req, res) => {
    try {
      const livro = await Livro.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!livro) {
        return res.status(404).json({ message: 'Livro não encontrado' });
      }
      res.json(livro);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

//Deletar Livro
exports.deleteLivro = async (req, res) => {
    try {
      const livro = await Livro.findByIdAndDelete(req.params.id);
   if (livro) {
    res.send('Livro deletado');
   } else {
    res.status(404).send('Livro não encontrado');
   }
 } catch (err) {
  res.status(500).send(err.message);
 }
 
};
