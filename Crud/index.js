const express = require('express');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc'); //swagger
const swaggerUi = require('swagger-ui-express'); //swagger
const auth = require('./auth'); // Middleware de autenticação
const basicAuth = require('./auth'); // Middleware de autenticação
const Livro = require('./models/livro'); //model livro
const User = require('./models/user'); //model user
const bodyParser = require('body-parser');
const { ObjectId } = mongoose.Types;

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =  'mongodb://localhost:27017/books';

mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexão com o Mongo:'));
db.once('open',() => {
    console.log('Conectado com o Mongo');
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());


  //Configuração Swwagger
  const swaggerOptions = {
    swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Livros',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
      schemas: {
        Livro: {
          type: 'object',
          properties: {
//            _id: {
//             type: 'string',
//            description: 'ID do livro',
//         },
            nome: {
              type: 'string',
              description: 'Nome do livro',
            },
            autor: {
              type: 'string',
              description: 'Autor do livro',
            },
            genero: {
              type: 'string',
              description: 'Gênero do livro',
            },
            paginas: {
              type: 'number',
              description: 'Número de páginas do livro',
            },
            editora: {
              type: 'string',
              description: 'Editora do livro',
            },
          },
        },
      },
    },
  },
    apis: [__filename], //referencia ao próprio arquivo
  };
  
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Aplicando autenticação básica para todas as rotas a partir deste ponto
  app.use(basicAuth);


   // Endpoint para obter todos os livros com filtros e paginação
   
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
   app.get('/livros', async (req, res) => {
    const { autor, editora, nome, minPaginas, start_at, limit } = req.query;
    const filters = {};
  
    if (autor) {
      filters.autor = new RegExp(autor, 'i'); // Pesquisa case-insensitive por autor
    }
    if (editora) {
      filters.editora = new RegExp(editora, 'i'); // Pesquisa case-insensitive por editora
    }
    if (nome) {
      filters.nome = new RegExp(nome, 'i'); // Pesquisa case-insensitive por título
    }
    if (minPaginas) {
      filters.paginas = { $gte: parseInt(minPaginas, 10) }; // Páginas maior ou igual a minPaginas
    }
  
    const startAt = parseInt(start_at, 10) || 0; // Default to 0 if not provided
    const limitVal = Math.min(parseInt(limit, 10) || 1000, 1000); // Default to 1000 and max limit 1000
  
    try {
      const livros = await Livro.find(filters)
        .skip(startAt)
        .limit(limitVal);
      res.json(livros);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

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

 // Endpoint para obter um livro por ID
 app.get('/livros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
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
});
 

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

  
  // Endpoint para criar um novo livro
  app.post('/livros', async (req, res) => {
    try {
      const livro = new Livro(req.body);
      await livro.save();
      res.status(201).json(livro);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
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
app.put('/livros/:id', async (req, res) => {
  try {
    const livro = await Livro.findByIdAndUpdate(new ObjectId(req.params.id), req.body, { new: true, runValidators: true });
    if (livro) {
      res.json(livro);
    } else {
      res.status(404).send('Livro não encontrado');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});
  
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

  // Endpoint para deletar um livro por ID
  app.delete('/livros/:id', async (req, res) => {
    try {
      const livro = await Livro.findByIdAndDelete(new ObjectId(req.params.id), req.body, { new: true, runValidators: true });
      if (livro) {
        res.send('Livro deletado');
      } else {
        res.status(404).send('Livro não encontrado');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
/**
 * @swagger
 * components:
 *   schemas:
 *     Livro:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - autor
 *         - genero 
 *         - paginas
 *         - editora
 *       properties:
 *         _id:
 *           type: String
 *           description: UID do livro
*          id:
 *           type: integer
 *           description: ID do livro
 *         nome:
 *           type: string
 *           description: Título do livro
 *         autor:
 *           type: string
 *           description: Autor do livro
 *         genero:
 *           type: string
 *           description: Gêneros do livro
 *         paginas:
 *           type: integer
 *           description: Número de páginas do livro
 *         editora:
 *           type: string
 *           description: Editora do livro
 */

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Swagger UI disponível em http://localhost:${PORT}/api-docs`);
  });