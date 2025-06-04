// --- Lista de países válidos ---
const PAISES_LIST = [
  "Afeganistao","Africa do Sul","Albania","Alemanha","Andorra","Angola","Anguila","Antarctica","Antigua e Barbuda","Arabia Saudita","Argelia","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijao","Bahamas","Bangladexe","Barbados","Barem","Belgica","Belize","Benin","Bermuda","Bielorrussia","Bolivia","Bosnia e Herzegovina","Botswana","Brasil","Brunei Darussalam","Bulgaria","Burquina Fasso","Burundi","Butao","Cabo Verde","Camaroes","Camboja","Canada","Catar","Cazaquistao","Republica Centro-Africana","Chade","Chequia","Chile","China","Chipre","Colombia","Comores","Congo","Coreia do Sul","Coreia do Norte","Costa do Marfim","Costa Rica","Croacia","Cuba","Curacau","Dinamarca","Dominica","Egipto","El Salvador","Emiratos Arabes Unidos","Equador","Eritreia","Eslovaquia","Eslovenia","Espanha","Essuatini","Estados Unidos","Estonia","Etiopia","Filipinas","Finlandia","França","Gabao","Gambia","Gana","Georgia","Georgia do Sul e Ilhas Sandwich","Gernsey","Gibraltar","Granada","Grecia","Gronelandia","Guadalupe","Guam","Guatemala","Guiana","Guiana Francesa","Guine","Guine Equatorial","Guine-Bissau","Haiti","Honduras","Hong Kong","Hungria","Iemen","Ilha de Man","Ilhas Aland","Ilhas Bouvet","Ilhas Caimao","Ilhas Christmas","Ilhas Cocos (Keeling)","Ilhas Cook","Ilhas Falkland (Malvinas)","Ilhas Faroe","Fiji","Ilhas Heard e Ilhas Mcdonald","Ilhas Marianas do Norte","Ilhas Marshall","Ilhas Menores Distantes dos Estados Unidos","Ilhas Norfolk","Ilhas Salomao","Ilhas Virgens (Britanicas)","Ilhas Virgens (Estados Unidos)","India","Indonesia","Irao","Iraque","Irlanda","Islandia","Israel","Italia","Jamaica","Japao","Jersey","Jibuti","Jordania","Quenia","Kiribati","Kuwait","Laos","Lesoto","Letonia","Libano","Liberia","Libia","Liechtenstein","Lituania","Luxemburgo","Macau","Macedonia do Norte","Madagascar","Malasia","Malawi","Maldivas","Mali","Malta","Marrocos","Martinica","Mauricia","Mauritania","Mayotte","Mexico","Mianmar","Micronesia","Mocambique","Moldavia","Monaco","Mongolia","Monserrate","Montenegro","Namibia","Nauru","Nepal","Nicaragua","Niger","Nigeria","Niue","Noruega","Nova Caledonia","Nova Zelandia","Oma","Paises Baixos","Paises Baixos Caribenhos","Palau","Panama","Papuasia-Nova Guine","Paquistao","Paraguai","Peru","Pitcairn","Polinesia Francesa","Polonia","Porto Rico","Portugal","Quirguizistao","Reino Unido","Republica Dominicana","Reuniao","Romenia","Ruanda","Russia","Samoa","Samoa Americana","Santa Helena","Santa Lucia","Santa Se (Cidade Estado do Vaticano)","Sao Bartolomeu","Sao Cristovao e Nevis","Sao Marino","Sao Martinho","Sao Martinho (Coletividade de Sao Martinho)","Sao Pedro e Miquelon","Sao Tome e Principe","Sao Vicente e Granadinas","Sara Ocidental","Senegal","Sri Lanca","Serra Leoa","Servia","Seychelles","Singapura","Siria","Somalia","Sudao","Sudao do Sul","Suecia","Suiça","Suriname","Svalbard e a Ilha de Jan Mayen","Tailandia","Taiwan","Tajiquistao","Tanzania, Republica Unida da","Territorio Britanico do Oceano Indico","Territorio Palestiniano Ocupado","Territorios Franceses do Sul","Timor Leste","Togo","Tokelau","Tonga","Trindade e Tobago","Tunisia","Turcos e Caicos","Turquemenistao","Turquia","Tuvalu","Ucrania","Uganda","Uruguai","Usbequistao","Vanuatu","Venezuela","Vietname","Wallis e Futuna","Zambia","Zimbabwe"
];

// Variáveis de estado
let paisSelecionado = null;
let zonaSelecionada = null;
let timeoutPais = null;

// Função para carregar qualquer SVG no div #map
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
              destacarNoMapa(selectedId);
          }
          if (typeof callback === 'function') callback();
      })
      .catch(() => {
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
    const mapDiv = document.getElementById('map');
    mapDiv.style.pointerEvents = 'none';
});

function destacarNoMapa(selectedId) {
    const mapDiv = document.getElementById('map');
    mapDiv.querySelectorAll('.geo.region').forEach(el => el.classList.remove('selected'));
    mapDiv.querySelectorAll('[data-zona].selected').forEach(el => el.classList.remove('selected'));

    if (selectedId) {
        const normalizado = String(selectedId).trim();
        let reg = Array.from(mapDiv.querySelectorAll('[data-zona]')).find(el =>
            String(el.getAttribute('data-zona')).trim() === normalizado
        );
        if (reg) {
            reg.classList.add('selected');
            return;
        }
        reg = mapDiv.querySelector(`#${CSS.escape(selectedId)} .geo.region`);
        if (!reg) reg = mapDiv.querySelector(`#${CSS.escape(selectedId)}.geo.region, .geo.region#${CSS.escape(selectedId)}`);
        if (reg) reg.classList.add('selected');
    }
}

// Eventos para o campo de país
document.getElementById('country').addEventListener('change', function() {
    const paisId = this.value.trim();
    if (!PAISES_LIST.includes(paisId)) {
        carregarMapa('svg/europamain.svg');
        paisSelecionado = null;
        zonaSelecionada = null;
        document.getElementById('zone').value = '';
        document.getElementById('zone').disabled = true;
        return;
    }
    zonaSelecionada = document.getElementById('zone').value.trim() || null;
    carregarMapa('svg/europamain.svg', paisId);

    clearTimeout(timeoutPais);
    if (paisId) {
        timeoutPais = setTimeout(() => {
            carregarMapa(`svg/${paisId}.svg`, null, function() {
                if (zonaSelecionada) {
                    destacarNoMapa(zonaSelecionada);
                }
            });
            paisSelecionado = paisId;
        }, 2000);
    } else {
        paisSelecionado = null;
    }
});

document.getElementById('country').addEventListener('input', function() {
    const paisId = this.value.trim();
    if (!paisId) {
        carregarMapa('svg/europamain.svg');
        paisSelecionado = null;
        zonaSelecionada = null;
        document.getElementById('zone').value = '';
        document.getElementById('zone').disabled = true;
    }
});

document.getElementById('zone').addEventListener('input', function() {
    const zonaId = this.value.trim();
    zonaSelecionada = zonaId || null;
    if (!zonaId && paisSelecionado) {
        carregarMapa(`svg/${paisSelecionado}.svg`, null, function() {});
    } else if (zonaId && paisSelecionado) {
        destacarNoMapa(zonaId);
    }
});

document.getElementById('zone').addEventListener('change', function() {
    const zonaId = this.value.trim();
    zonaSelecionada = zonaId || null;
    if (zonaId) {
        destacarNoMapa(zonaId);
    }
});

// Função para limpar zona manualmente
function limparZona() {
    if (paisSelecionado) {
        carregarMapa(`svg/${paisSelecionado}.svg`, null, function() {});
        zonaSelecionada = null;
    }
}

// Função para limpar país manualmente
function limparPais() {
    carregarMapa('svg/europamain.svg');
    paisSelecionado = null;
    zonaSelecionada = null;
}
