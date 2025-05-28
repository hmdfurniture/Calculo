// js/paises.js

// Lista de países permitidos (ordem alfabética)
const PAISES_LIST = [
  "Albania","Alemanha","Andorra","Armenia","Austria","Azerbaijão","Belgica","Bielorrussia",
  "Bosnia e Herzegovina","Bulgaria","Chequia","Chipre","Croacia","Dinamarca","Eslovenia",
  "Eslovaquia","Espanha","Estonia","Finlandia","França","Georgia","Grecia","Hungria",
  "Irlanda","Islandia","Italia","Kosovo","Letonia","Liechtenstein","Lituania","Luxemburgo",
  "Macedonia do Norte","Malta","Moldavia","Montenegro","Noruega","Paises Baixos","Polonia",
  "Portugal","Reino Unido","Romenia","Russia","San Marino","Servia","Suecia","Suiça",
  "Turquia","Ucrania"
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
