require('dotenv').config();
const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicAuth = require('./middlewares/auth'); // Middleware de autenticação
const livroRoutes = require('./routes/livroRoutes'); // Rotas de livros
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPSPORT = process.env.HTTPSPORT || 3443;




var httpsoptions = {
  key: fs.readFileSync(process.env.API_KEY || './cert/private.key'),
  cert: fs.readFileSync(process.env.API_CRT || './cert/public.crt')
};


/*
//conexão mongo local
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
*/

//conexão mongo Atlas
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o Mongo:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB Atlas');

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
  console.log(`Servidor HTTP escutando na porta ${PORT}`);
  console.log(`Swagger UI disponível em http://localhost:${PORT}/api-docs`);
});

https.createServer(httpsoptions, app).listen(HTTPSPORT, () => {
  console.log(`Servidor HTTPS escutando na porta ${HTTPSPORT}`);
  console.log(`Swagger UI disponível em https://localhost:${HTTPSPORT}/api-docs`);
});
