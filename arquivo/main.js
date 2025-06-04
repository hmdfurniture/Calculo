function addLine() {
    const container = document.getElementById("dimension-container");

    const newLine = document.createElement("div");
    newLine.className = "form-group dimension-line";

    newLine.innerHTML = `
        <div>
            <select class="type" oninput="removeHighlight(this)">
                <option value="box">Box</option>
                <option value="pallet">Pallet</option>
            </select>
        </div>
        <div>
            <input type="number" class="width" min="0" max="999" maxlength="3" oninput="validateInput(this)">
        </div>
        <div>
            <input type="number" class="length" min="0" max="999" maxlength="3" oninput="validateInput(this)">
        </div>
        <div>
            <input type="number" class="height" min="0" max="999" maxlength="3" oninput="validateInput(this)">
        </div>
        <div>
            <input type="number" class="quantity" min="0" max="999" maxlength="3" oninput="validateInput(this)">
        </div>
        <div>
            <button class="remove-button" onclick="removeLine(this)">Remove</button>
        </div>
    `;

    container.appendChild(newLine);
}

function removeLine(button) {
    const line = button.parentElement.parentElement;
    line.remove();
}

// Listeners para inputs de country/zone
document.getElementById("country").addEventListener("input", () => {
    const countryInput = document.getElementById("country");
    const zoneInput = document.getElementById("zone");
    const zoneList = document.getElementById("zone-list");

    if (countryInput.value.trim() === "") {
        zoneInput.value = "";
        zoneInput.disabled = true;
        zoneList.innerHTML = "";
        document.getElementById("result").innerHTML = "";  // Limpa os resultados
        document.getElementById("mensagens").innerHTML = ""; // Limpa mensagens também
        hideMoreBtn();
    }
});

document.getElementById("country").addEventListener("focus", () => {
    showDropdown("country-list");
});

document.getElementById("country").addEventListener("blur", () => {
    setTimeout(() => hideDropdown("country-list"), 200);
});

document.getElementById("zone").addEventListener("focus", () => {
    showDropdown("zone-list");
});

document.getElementById("zone").addEventListener("blur", () => {
    setTimeout(() => hideDropdown("zone-list"), 200);
});

// Carregar dados ao iniciar a página
window.onload = loadSupplierData;

// Função de cálculo central dinâmica
function calculateResults() {
    // 1. Recolher dimensões
    const lines = document.querySelectorAll(".dimension-line");
    const dimensoes = Array.from(lines).map(line => ({
        type: line.querySelector(".type").value,
        width: parseFloat(line.querySelector(".width").value),
        length: parseFloat(line.querySelector(".length").value),
        height: parseFloat(line.querySelector(".height").value),
        quantity: parseInt(line.querySelector(".quantity").value, 10)
    }));

    // 2. Obter país e zona selecionados
    const country = document.getElementById("country").value;
    const zone = document.getElementById("zone").value;

    // 3. Determinar destinos e tabelas ativas
    const destinos = [];
    tables.forEach(table => {
        const destino = table.destinations.find(dest => dest.country === country && dest.code === zone);
        if (destino) destinos.push({ table, destino });
    });

    // 4. Cálculo dinâmico
    const resultados = calcularParaTodasTabelas(destinos, dimensoes);

    // 5. Mostrar resultados
    const resultDiv = document.getElementById("result");
    if (resultados.length === 0) {
        resultDiv.innerHTML = "<p>Nenhuma tabela/cálculo disponível para este destino.</p>";
        document.getElementById("mensagens").innerHTML = "";
        return;
    }
    let html = "";
    resultados.forEach(r => {
        if (r.resultado.erro) {
            html += `<div class="resultado-bloco">
                <img src="images/${r.tabela}.png" class="logo-tabela" alt="${r.tabela}">
                <p>${r.resultado.erro}</p>
            </div>`;
        } else {
            html += `<div class="resultado-bloco">
                <img src="images/${r.tabela}.png" class="logo-tabela" alt="${r.tabela}">
                <p>Total LDM: ${r.resultado.totalLdm?.toFixed(2) ?? "0"}</p>
                <p>Total m³: ${r.resultado.totalCubicMeters?.toFixed(3) ?? "0"}</p>
                <p>Peso Total: ${r.resultado.totalWeight?.toFixed(2) ?? "0"} kg</p>
                <p>Peso tarifário: ${r.resultado.scaledWeight ?? "0"}</p>
                <p>Escalão: ${r.resultado.rateLabel ?? "-"}</p>
                <p>Valor Escalão: €${r.resultado.rateValue?.toFixed(2) ?? "-"}</p>
                <p>Custo Final: <b>€${r.resultado.cost?.toFixed(2) ?? "0"}</b></p>
            </div>`;
        }
    });
    resultDiv.innerHTML = html;

// Mostra o botão dos 3 pontos se houver resultados
if(resultados.length > 0) {
    showMoreBtn();
} else {
    hideMoreBtn();
}

// 6. Mostrar mensagens explicativas/contextuais
const mensagensDiv = document.getElementById("mensagens");
let htmlMensagens = "";
resultados.forEach(r => {
    if (r.resultado.mensagens && r.resultado.mensagens.length > 0) {
        htmlMensagens += `
            <div class="mensagem-explicativa-bloco">
                <img src="images/${r.tabela}.png" class="mensagem-explicativa-logo" alt="${r.tabela}">
                <ul class="mensagem-explicativa-lista">
                    ${r.resultado.mensagens.map(m => `<li>${m}</li>`).join("")}
                </ul>
            </div>
        `;
    }
});
mensagensDiv.innerHTML = htmlMensagens;
}
