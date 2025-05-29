const fs = require("fs");
const path = require("path");

const countriesPath = path.resolve(__dirname, "../json/countries.json");
const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8"));

const files = [
  "js/mapas/mapa-controller.js",
  "js/paises.js"
];

const regex = /const\s+PAISES_LIST\s*=\s*\[[\s\S]*?\];/m;
const newArray = `const PAISES_LIST = [\n  "${countries.join('","')}"\n];`;

files.forEach(file => {
  const filePath = path.resolve(file);
  let content = fs.readFileSync(filePath, "utf8");
  if (regex.test(content)) {
    content = content.replace(regex, newArray);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Atualizado: ${file}`);
  } else {
    console.warn(`Não encontrado array em: ${file}`);
  }
});
