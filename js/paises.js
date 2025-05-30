// js/paises.js

// Lista de países permitidos (ordem alfabética)
const PAISES_LIST = [
  "Afeganistao","Africa do Sul","Albania","Alemanha","Andorra","Angola","Anguila","Antarctica","Antigua e Barbuda","Arabia Saudita","Argelia","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijao","Bahamas","Bangladexe","Barbados","Barem","Belgica","Belize","Benin","Bermuda","Bielorrussia","Bolivia","Bosnia e Herzegovina","Botswana","Brasil","Brunei Darussalam","Bulgaria","Burquina Fasso","Burundi","Butao","Cabo Verde","Camaroes","Camboja","Canada","Catar","Cazaquistao","Republica Centro-Africana","Chade","Chequia","Chile","China","Chipre","Colombia","Comores","Congo","Coreia do Sul","Coreia do Norte","Costa do Marfim","Costa Rica","Croacia","Cuba","Curacau","Dinamarca","Dominica","Egipto","El Salvador","Emiratos Arabes Unidos","Equador","Eritreia","Eslovaquia","Eslovenia","Espanha","Essuatini","Estados Unidos","Estonia","Etiopia","Filipinas","Finlandia","Franca","Gabao","Gambia","Gana","Georgia","Georgia do Sul e Ilhas Sandwich","Gernsey","Gibraltar","Granada","Grecia","Gronelandia","Guadalupe","Guam","Guatemala","Guiana","Guiana Francesa","Guine","Guine Equatorial","Guine-Bissau","Haiti","Honduras","Hong Kong","Hungria","Iemen","Ilha de Man","Ilhas Aland","Ilhas Bouvet","Ilhas Caimao","Ilhas Christmas","Ilhas Cocos (Keeling)","Ilhas Cook","Ilhas Falkland (Malvinas)","Ilhas Faroe","Fiji","Ilhas Heard e Ilhas Mcdonald","Ilhas Marianas do Norte","Ilhas Marshall","Ilhas Menores Distantes dos Estados Unidos","Ilhas Norfolk","Ilhas Salomao","Ilhas Virgens (Britanicas)","Ilhas Virgens (Estados Unidos)","India","Indonesia","Irao","Iraque","Irlanda","Islandia","Israel","Italia","Jamaica","Japao","Jersey","Jibuti","Jordania","Quenia","Kiribati","Kuwait","Laos","Lesoto","Letonia","Libano","Liberia","Libia","Liechtenstein","Lituania","Luxemburgo","Macau","Macedonia do Norte","Madagascar","Malasia","Malawi","Maldivas","Mali","Malta","Marrocos","Martinica","Mauricia","Mauritania","Mayotte","Mexico","Mianmar","Micronesia","Mocambique","Moldavia","Monaco","Mongolia","Monserrate","Montenegro","Namibia","Nauru","Nepal","Nicaragua","Niger","Nigeria","Niue","Noruega","Nova Caledonia","Nova Zelandia","Oma","Paises Baixos","Paises Baixos Caribenhos","Palau","Panama","Papuasia-Nova Guine","Paquistao","Paraguai","Peru","Pitcairn","Polinesia Francesa","Polonia","Porto Rico","Portugal","Quirguizistao","Reino Unido","Republica Dominicana","Reuniao","Romenia","Ruanda","Russia","Samoa","Samoa Americana","Santa Helena","Santa Lucia","Santa Se (Cidade Estado do Vaticano)","Sao Bartolomeu","Sao Cristovao e Nevis","Sao Marino","Sao Martinho","Sao Martinho (Coletividade de Sao Martinho)","Sao Pedro e Miquelon","Sao Tome e Principe","Sao Vicente e Granadinas","Sara Ocidental","Senegal","Sri Lanca","Serra Leoa","Servia","Seychelles","Singapura","Siria","Somalia","Sudao","Sudao do Sul","Suecia","Suica","Suriname","Svalbard e a Ilha de Jan Mayen","Tailandia","Taiwan","Tajiquistao","Tanzania, Republica Unida da","Territorio Britanico do Oceano Indico","Territorio Palestiniano Ocupado","Territorios Franceses do Sul","Timor Leste","Togo","Tokelau","Tonga","Trindade e Tobago","Tunisia","Turcos e Caicos","Turquemenistao","Turquia","Tuvalu","Ucrania","Uganda","Uruguai","Usbequistao","Vanuatu","Venezuela","Vietname","Wallis e Futuna","Zambia","Zimbabwe"
];

// Função para criar e associar o autocomplete a um input HTML
function attachCountryAutocomplete(input) {
  let currentFocus;
  input.setAttribute("autocomplete", "off");

  input.addEventListener("input", function() {
    closeAllLists();
    const val = this.value;
    if (!val) return false;
    currentFocus = -1;

    // Cria o container da lista
    const listDiv = document.createElement("div");
    listDiv.setAttribute("class", "autocomplete-items");
    listDiv.setAttribute("style", "position:absolute;z-index:1001;background:white;border:1px solid #ccc;max-height:180px;overflow-y:auto;");
    this.parentNode.appendChild(listDiv);

    // Filtra e mostra as sugestões
    const valNorm = val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    let count = 0;
    for (let pais of PAISES_LIST) {
      const paisNorm = pais.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      if (paisNorm.startsWith(valNorm)) {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = "<strong>" + pais.substr(0, val.length) + "</strong>" + pais.substr(val.length);
        itemDiv.innerHTML += `<input type='hidden' value='${pais}'>`;
        itemDiv.addEventListener("click", function() {
          input.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
          input.dispatchEvent(new Event("change"));
        });
        listDiv.appendChild(itemDiv);
        count++;
      }
    }
    if (count === 0) {
      const itemDiv = document.createElement("div");
      itemDiv.innerHTML = "<span style='color:#999'>Nenhum país encontrado</span>";
      listDiv.appendChild(itemDiv);
    }
  });

  // Navegação por teclas
  input.addEventListener("keydown", function(e) {
    let list = this.parentNode.querySelector(".autocomplete-items");
    if (list) list = list.getElementsByTagName("div");
    if (e.key === "ArrowDown") {
      currentFocus++;
      addActive(list);
    } else if (e.key === "ArrowUp") {
      currentFocus--;
      addActive(list);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (list && currentFocus > -1) {
        list[currentFocus].click();
      }
    }
  });

  function addActive(list) {
    if (!list) return false;
    removeActive(list);
    if (currentFocus >= list.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = list.length - 1;
    list[currentFocus].classList.add("autocomplete-active");
    list[currentFocus].scrollIntoView({ block: "nearest" });
  }
  function removeActive(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    const lists = document.querySelectorAll(".autocomplete-items");
    for (let div of lists) {
      if (elmnt !== div && elmnt !== input) div.parentNode.removeChild(div);
    }
  }
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}

// Função para validar se o valor está na lista de países (exato)
function isPaisValido(valor) {
  return PAISES_LIST.includes(valor);
}
