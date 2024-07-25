# Script para converter csv em json.



Precisa de 2 bibliotecas

- npm install csv-parser

- npm install js



Com uma característica especifica para que a chave genero, possa separar os diferentes itens da coluna por /

E as chaves ano, rating e paginas devem ser indicadas como numéricas



ele lê o arquivo indicado no caminho da linha 33:

processCSV('path/to/your/file.csv')

E o arquivo gerado tem nome: output.json e pode ser importado diretamente no mongoDB