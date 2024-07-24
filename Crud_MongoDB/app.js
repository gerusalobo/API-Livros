const express = require('express');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicAuth = require('./auth'); // Middleware de autenticação
const livroRoutes = require('./routes/livroRoutes'); // Rotas de livros
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/books';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o Mongo:'));
db.once('open', () => {
  console.log('Conectado ao Mongo');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Configuração Swagger
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
  apis: ['./routes/livroRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de autenticação
app.use(basicAuth);

// Rotas
app.use('/livros', livroRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger UI disponível em http://localhost:${PORT}/api-docs`);
});
