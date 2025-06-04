// Coloca este ficheiro na raiz do repositório ou adapta o caminho para a pasta Tables

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../../Tables');

const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.json') && f !== 'tables-list.json');

fs.writeFileSync(
  path.join(dir, 'tables-list.json'),
  JSON.stringify(files, null, 2)
);

console.log('tables-list.json gerado com:', files);
