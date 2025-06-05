const fs = require("fs");
const path = require("path");

// Caminho para o json oficial de países
const countriesPath = path.resolve(__dirname, "../json/countries.json");
const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8"));

// Helper para normalizar strings (ignorar acentos, case e espaços)
function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Mapeamento: versão normalizada => versão oficial
const countryMap = {};
countries.forEach(p => {
  countryMap[normalize(p)] = p;
});

// --- Corrigir campo "country" em todos os .json da pasta /Tables ---
const tablesDir = path.resolve(__dirname, "../Tables");
const tableFiles = fs.readdirSync(tablesDir).filter(f => f.endsWith(".json"));

tableFiles.forEach(filename => {
  const filePath = path.join(tablesDir, filename);
  let changed = false;
  let json = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Suporta tanto array de objetos quanto objeto único
  const entries = Array.isArray(json) ? json : [json];

  entries.forEach(entry => {
    if (!entry.country) return;

    const normalized = normalize(entry.country);
    if (countryMap[normalized]) {
      // Corrige para o nome oficial se for diferente (caso, acentos, espaços)
      if (entry.country !== countryMap[normalized]) {
        entry.country = countryMap[normalized];
        changed = true;
      }
    } else {
      // País não existe na lista oficial → limpa
      entry.country = "";
      changed = true;
    }
  });

  // Salva apenas se houve mudança
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(Array.isArray(json) ? entries : entries[0], null, 4), "utf8");
    console.log(`Corrigido: ${filePath}`);
  }
});

// --- Atualiza arrays de países nos ficheiros JS principais ---
const jsFiles = [
  path.resolve(__dirname, "mapas/mapa-controller.js"),
  path.resolve(__dirname, "paises.js")
];

const regex = /const\s+PAISES_LIST\s*=\s*\[[\s\S]*?\];/m;
const newArray = `const PAISES_LIST = [\n  "${countries.join('","')}"\n];`;

jsFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  if (regex.test(content)) {
    content = content.replace(regex, newArray);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Atualizado: ${filePath}`);
  } else {
    console.warn(`Não encontrado array em: ${filePath}`);
  }
});
