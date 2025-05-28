// --- Adiciona o array de países válidos no topo deste ficheiro ---
const PAISES_LIST = [
  "Albania","Alemanha","Andorra","Armenia","Austria","Azerbaijão","Belgica","Bielorrussia",
  "Bosnia e Herzegovina","Bulgaria","Chequia","Chipre","Croacia","Dinamarca","Eslovenia",
  "Eslovaquia","Espanha","Estonia","Finlandia","França","Georgia","Grecia","Hungria",
  "Irlanda","Islandia","Italia","Kosovo","Letonia","Liechtenstein","Lituania","Luxemburgo",
  "Macedonia do Norte","Malta","Moldavia","Montenegro","Noruega","Paises Baixos","Polonia",
  "Portugal","Reino Unido","Romenia","Russia","San Marino","Servia","Suecia","Suiça",
  "Turquia","Ucrania"
];

// Função genérica para carregar qualquer SVG no div #map
function carregarMapa(svgPath, selectedId = null, callback = null) {
    fetch(svgPath)
      .then(r => {
          if (!r.ok) throw new Error("SVG não encontrado");
          return r.text();
      })
      .then(svg => {
          const mapDiv = document.getElementById('map');
          mapDiv.innerHTML = svg;
          mapDiv.style.display = "flex";
          mapDiv.style.alignItems = "center";
          mapDiv.style.justifyContent = "center";
          mapDiv.style.background = "white";

          // Destaca a região se um ID for especificado
          if (selectedId) {
              const reg = mapDiv.querySelector(`#${CSS.escape(selectedId)}.geo.region, .geo.region#${CSS.escape(selectedId)}`);
              if (reg) reg.classList.add('selected');
              else console.warn('País não encontrado no SVG:', selectedId);
          }

          if (typeof callback === 'function') callback();
      })
      .catch(() => {
          // Se falhar a carregar um país, volta ao mapa inicial da Europa
          if (svgPath !== 'svg/europamain.svg') {
              carregarMapa('svg/europamain.svg');
          } else {
              const mapDiv = document.getElementById('map');
              mapDiv.innerHTML = "<b>Erro ao carregar o mapa.</b>";
          }
      });
}

// Carrega o mapa da Europa ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
    carregarMapa('svg/europamain.svg');
});

// Função para destacar uma região no mapa carregado (deve ser chamada após carregar o SVG)
function destacarNoMapa(selectedId) {
    const mapDiv = document.getElementById('map');
    mapDiv.querySelectorAll('.geo.region').forEach(el => el.classList.remove('selected'));
    if (selectedId) {
        const reg = mapDiv.querySelector(`#${CSS.escape(selectedId)}.geo.region, .geo.region#${CSS.escape(selectedId)}`);
        if (reg) reg.classList.add('selected');
    }
}

// Lógica de integração com os selects do HTML
let paisSelecionado = null;
let zonaSelecionada = null;
let timeoutPais = null;

// --- ALTERADO: Evento para garantir país válido ---
document.getElementById('country').addEventListener('change', function() {
    const paisId = this.value.trim();
    // Só permite países válidos (exatamente iguais aos do array)
    if (!PAISES_LIST.includes(paisId)) {
        carregarMapa('svg/europamain.svg');
        paisSelecionado = null;
        return;
    }
    zonaSelecionada = null;
    carregarMapa('svg/europamain.svg', paisId);

    clearTimeout(timeoutPais);
    if (paisId) {
        timeoutPais = setTimeout(() => {
            carregarMapa(`svg/${paisId}.svg`);
            paisSelecionado = paisId;
        }, 2000);
    } else {
        paisSelecionado = null;
    }
});

document.getElementById('zone').addEventListener('change', function() {
    const zonaId = this.value;
    zonaSelecionada = zonaId;
    if (paisSelecionado) {
        carregarMapa(`svg/${paisSelecionado}.svg`, zonaId);
    }
});

// Limpar zona: volta ao mapa do país sem destaque
function limparZona() {
    if (paisSelecionado) {
        carregarMapa(`svg/${paisSelecionado}.svg`);
        zonaSelecionada = null;
    }
}

// Limpar país: volta ao mapa da Europa sem destaque
function limparPais() {
    carregarMapa('svg/europamain.svg');
    paisSelecionado = null;
    zonaSelecionada = null;
}

// Torna os paths não interativos ao rato (mantém apenas pointer-events: none no container)
document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('map');
    mapDiv.style.pointerEvents = 'none';
});
