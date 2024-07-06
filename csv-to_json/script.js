const fs = require('fs');
const csv = require('csv-parser');

function processCSV(filePath) {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      const jsonObject = {};
      Object.keys(data).forEach((key) => {
        if (key === 'genero') {
          jsonObject[key] = data[key].split('/').map((item) => item.trim());
        } else if (['ano', 'paginas', 'rating'].includes(key)) {
          jsonObject[key] = Number(data[key]);
        } else {
          jsonObject[key] = data[key];
        }
      });
      results.push(jsonObject);
    })
    .on('end', () => {
      const json = JSON.stringify(results, null, 2);
      console.log(json);

      // Opcional: salvar o JSON em um arquivo
      fs.writeFileSync('output.json', json, 'utf8');
      console.log('Arquivo JSON criado: output.json');
    });
}

// Chame a função com o caminho para o arquivo CSV
processCSV('livros.csv');