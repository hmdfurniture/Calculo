// Mapa Europa Geral - Teste de uma região

const svgEuropa = `
<svg viewBox="0 0 520 520" style="width:100%;height:100%;">
   <g class="map">
      <g class="regions">
         <g class="region" id="europa">
            <path class="geo region"
             d="M100,100 L400,100 L400,400 L100,400 Z"/>
         </g>
      </g>
      <path class="geo borders"
        d="M100,100 L400,100 L400,400 L100,400 Z"
        style="fill:none;stroke:#fff;stroke-width:3;"/>
   </g>
</svg>
`;

// Função para carregar o mapa geral no container #map
function loadMapaEuropaMain() {
    const mapDiv = document.getElementById('map');
    mapDiv.innerHTML = svgEuropa;

    // Torna o SVG responsivo
    mapDiv.style.display = "flex";
    mapDiv.style.alignItems = "center";
    mapDiv.style.justifyContent = "center";
    mapDiv.style.background = "white";

    // Adiciona interação
    mapDiv.querySelectorAll('.region').forEach(region => {
        region.addEventListener('click', function() {
            // Remove seleção anterior
            mapDiv.querySelectorAll('.region').forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            // Mensagem de teste
            const msgDiv = document.getElementById('mensagens');
            if(msgDiv) msgDiv.innerHTML = `Selecionou a região: <b>${this.id}</b>`;
        });
    });
}

// Carrega o mapa geral ao abrir a página
window.addEventListener('DOMContentLoaded', loadMapaEuropaMain);

// CSS para destaque da região selecionada (adicione no seu CSS global se não existir)
const style = document.createElement('style');
style.textContent = `
#map svg {
    width: 100%;
    height: 100%;
    display: block;
    margin: 0 auto;
}
.region path {
    fill: #b0c4de;
    stroke: #333;
    stroke-width: 2;
    cursor: pointer;
    transition: fill 0.2s;
}
.region.selected path {
    fill: #007bff;
}
.region:hover path {
    fill: #6fa9e6;
}
/* Fronteiras do mapa: branco */
.geo.borders, .geo.borders, .borders {
    stroke: #fff !important;
}
`;
document.head.appendChild(style);
