### Arquivos e Diretórios

#### 1. `app.js`

Este é o ponto de entrada do aplicativo. Suas principais funções incluem:

- **Configuração do Servidor**: Inicializa o servidor Express e define a porta em que o aplicativo irá rodar.
- **Conexão com o MongoDB**: Utiliza o Mongoose para conectar-se ao MongoDB Atlas ou a um servidor local de MongoDB, dependendo da configuração.
- **Configuração de Middlewares**: Inclui middlewares para parsing de requisições (`bodyParser`), autenticação básica (`auth.js`) e outros.
- **Documentação da API**: Integração com Swagger para gerar e servir a documentação da API em `/api-docs`.
- **Definição de Rotas**: As rotas definidas em `livroRoutes.js` são montadas em `/livros`.

#### 2. `controllers/livroController.js`

Este controlador contém a lógica de negócios para manipulação de dados de livros. Suas funções principais incluem:

- **`getLivros`**: Recupera e retorna todos os livros do banco de dados.
- **`getLivroById`**: Recupera e retorna um livro específico pelo ID.
- **`createLivro`**: Cria um novo livro com os dados fornecidos e o armazena no banco de dados.
- **`updateLivro`**: Atualiza um ou mais campos de um livro existente identificado por ID.
- **`deleteLivro`**: Remove um livro do banco de dados pelo ID.

#### 3. `middlewares/auth.js`

Este middleware implementa a autenticação básica. Ele verifica o cabeçalho `Authorization` das requisições e autentica o usuário com base em um nome de usuário e senha pré-definidos.

#### 4. `middlewares/validateAndSanitize.js`

Contém middleware para validação e sanitização de dados de entrada. Utiliza o `express-validator` para garantir que os dados recebidos estejam corretos e seguros:

- **Validação de Campos**: Verifica se os campos obrigatórios estão presentes e se os dados estão no formato esperado (e.g., strings, números).
- **Sanitização de Entrada**: Limpa e sanitiza os dados para prevenir ataques como injeção de SQL ou XSS.
- **Gestão de Erros**: Se houver erros de validação, responde com um status 400 e uma mensagem de erro detalhada.

#### 5. `models/Livro.js`

Define o esquema do modelo de livro utilizando o Mongoose. Os campos do modelo incluem:

- **`nome`**: Nome do livro (string).
- **`autor`**: Autor do livro (string).
- **`genero`**: Gênero do livro (string).
- **`paginas`**: Número de páginas do livro (número).
- **`editora`**: Editora do livro (string).

Este modelo é utilizado para interagir com a coleção de livros no MongoDB.

#### 6. `routes/livroRoutes.js`

Define as rotas da API para o recurso `Livro`. Cada rota é associada a uma função específica do `livroController`:

- **`GET /livros`**: Chama `getLivros` para listar todos os livros.
- **`GET /livros/:id`**: Chama `getLivroById` para obter um livro específico.
- **`POST /livros`**: Chama `createLivro` para criar um novo livro.
- **`PUT /livros/:id`**: Chama `updateLivro` para atualizar um livro existente.
- **`DELETE /livros/:id`**: Chama `deleteLivro` para remover um livro.