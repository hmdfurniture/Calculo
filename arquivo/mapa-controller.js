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
              // Espera o SVG ser injetado, e só então aplica a classe
              // Não precisa de timeout pois é síncrono após innerHTML
              const reg = mapDiv.querySelector(`#${CSS.escape(selectedId)}.geo.region, .geo.region#${CSS.escape(selectedId)}`);
              if (reg) reg.classList.add('selected');
              else console.warn('País não encontrado no SVG:', selectedId);
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
// (Esta função não é usada no fluxo normal, mas pode ser útil se quiseres destacar sem recarregar SVG)
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

// Quando o utilizador escolhe um país
document.getElementById('country').addEventListener('change', function() {
    const paisId = this.value;
    zonaSelecionada = null;

    // Debug: mostra o valor selecionado
    // console.log('Selecionado:', paisId);

    // Destaca o país no mapa Europa
    carregarMapa('svg/europamain.svg', paisId);

    // Após 2 segundos, carrega o mapa do país
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

// Remove o bloco de CSS injetado via JS para evitar conflitos

// Torna os paths não interativos ao rato (mantém apenas pointer-events: none no container)
document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('map');
    mapDiv.style.pointerEvents = 'none';
});
