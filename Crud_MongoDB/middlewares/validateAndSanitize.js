// middlewares/validateAndSanitize.js

const { body, validationResult } = require('express-validator');
const validator = require('validator');

const validateAndSanitize = [
  body('nome')
    .trim()
    //.notEmpty().withMessage('Nome é obrigatório')
    .isString().withMessage('Nome deve ser uma string')
    .customSanitizer(value => validator.escape(value)),
  body('autor')
    .trim()
    //.notEmpty().withMessage('Autor é obrigatório')
    .isString().withMessage('Autor deve ser uma string')
    .customSanitizer(value => validator.escape(value)),
  body('genero')
    .trim()
   //.notEmpty().withMessage('Gênero é obrigatório')
    .isString().withMessage('Gênero deve ser uma string')
    .customSanitizer(value => validator.escape(value)),
  body('paginas')
    .trim()
    //.notEmpty().withMessage('Número de páginas é obrigatório')
    .isInt({ min: 1 }).withMessage('Número de páginas deve ser um inteiro positivo')
    .toInt(), // Converte para inteiro
  body('editora')
    .trim()
   // .notEmpty().withMessage('Editora é obrigatória')
    .isString().withMessage('Editora deve ser uma string')
    .customSanitizer(value => validator.escape(value)),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateAndSanitize;
