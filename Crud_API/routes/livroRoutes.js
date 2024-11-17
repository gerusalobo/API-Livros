const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livrocontroller');
const validateAndSanitize = require('../middlewares/validateAndSanitize');

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Retorna a lista de todos os livros
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: query
 *         name: autor
 *         schema:
 *           type: string
 *         description: Nome do autor
 *       - in: query
 *         name: editora
 *         schema:
 *           type: string
 *         description: Nome da editora
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: Genero do Livro
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Título do livro
 *       - in: query
 *         name: minPaginas
 *         schema:
 *           type: integer
 *         description: Número mínimo de páginas
 *       - in: query
 *         name: start_at
 *         schema:
 *           type: integer
 *         description: Índice inicial para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *           maximum: 1000
 *         description: Número máximo de livros por página
 *     responses:
 *       200:
 *         description: Uma lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livro'
 *       401:
 *         description: Não autorizado
 */
router.get('/', livroController.getLivros);

/**
 * @swagger
 * /livros/{_id}:
 *   get:
 *     summary: Retorna um livro pelo ID
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Detalhes do livro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       400:
 *         description: ID Invalido
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Livro não encontrado
 */
router.get('/:id', livroController.getLivroById);

/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Cria um novo livro
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.post('/',validateAndSanitize, livroController.createLivro);

/**
 * @swagger
 * /livros/{_id}:
 *   put:
 *     summary: Atualiza um livro pelo ID
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id', validateAndSanitize, livroController.updateLivro);

/**
 * @swagger
 * /livros/{_id}:
 *   delete:
 *     summary: Deleta um livro pelo ID
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do livro
 *     responses:
 *       204:
 *         description: Livro deletado com sucesso
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', livroController.deleteLivro);

module.exports = router;
