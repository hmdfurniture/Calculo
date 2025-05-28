// mapa-controller.js

// Função genérica para carregar qualquer SVG no div #map
function carregarMapa(svgPath, selectedId = null, callback = null) {
    fetch(svgPath)
      .then(r => r.text())
      .then(svg => {
          const mapDiv = document.getElementById('map');
          mapDiv.innerHTML = svg;
          mapDiv.style.display = "flex";
          mapDiv.style.alignItems = "center";
          mapDiv.style.justifyContent = "center";
          mapDiv.style.background = "white";

          // Destaca a região se um ID for especificado
          if (selectedId) {
              const reg = mapDiv.querySelector(`#${selectedId}.geo.region, .geo.region#${selectedId}`);
              if (reg) reg.classList.add('selected');
          }

          if (typeof callback === 'function') callback();

          // O mapa NÃO é interativo ao clique!
      })
      .catch(() => {
          const mapDiv = document.getElementById('map');
          mapDiv.innerHTML = "<b>Erro ao carregar o mapa.</b>";
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
        const reg = mapDiv.querySelector(`#${selectedId}.geo.region, .geo.region#${selectedId}`);
        if (reg) reg.classList.add('selected');
    }
}

// Lógica de integração com os selects do HTML
let paisSelecionado = null;
let zonaSelecionada = null;
let timeoutPais = null;

// Quando o utilizador escolhe um país
document.getElementById('country').addEventListener('change', function() {
    const paisId = this.value;
    zonaSelecionada = null;

    // Destaca o país no mapa Europa
    carregarMapa('svg/europamain.svg', paisId);

    // Após 2-3 segundos, carrega o mapa do país
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

// Quando o utilizador escolhe uma zona
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

// CSS para destaque da região selecionada (caso não esteja já no global)
const style = document.createElement('style');
style.textContent = `
#map svg {
    width: 100%;
    height: 100%;
    display: block;
    margin: 0 auto;
}
.geo.region {
    fill: #b0c4de;
    stroke: #333;
    stroke-width: 2;
    transition: fill 0.2s;
}
.geo.region.selected {
    fill: #007bff;
}
.geo.borders, .borders {
    stroke: #fff !important;
}
`;
document.head.appendChild(style);

// Torna os paths não interativos ao rato
document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('map');
    mapDiv.style.pointerEvents = 'none';
});
