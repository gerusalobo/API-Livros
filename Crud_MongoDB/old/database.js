const { MongoClient } = require('mongodb');

// URL de conexão com o MongoDB Atlas
const uri = 'mongodb+srv://gerusalobo:CerKmY3h2Jlzojxq@gwolf.wl7fm8d.mongodb.net/?retryWrites=true&w=majority&appName=GWOLF';

// Crie uma nova instância do MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // Conecte ao servidor
    await client.connect();
    console.log('Conectado ao MongoDB Atlas');

    // Seleciona o banco de dados e a coleção
    const database = client.db('books');
    const collection = database.collection('users');

    // Busca o primeiro documento na coleção
    const firstDocument = await collection.findOne({});
    console.log('Primeiro documento:', firstDocument);

  } catch (err) {
    console.error('Erro ao conectar ou buscar dados:', err);
  } finally {
    // Certifique-se de fechar a conexão quando terminar
    await client.close();
  }
}

run().catch(console.dir);