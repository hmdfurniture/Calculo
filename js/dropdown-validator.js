// --- dropdown-validator.js ---
// Valida country e zone: só aceita opções do dropdown, ignora acentos/maiúsculas/ç, e mostra mensagem clara no #result

function normalizarTexto(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s]/gi, '')
        .trim();
}

function mostrarErroNoResult(msg) {
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
        resultDiv.innerHTML = `<p class="error-message">${msg}</p>`;
    }
}

function esconderErroNoResult() {
    const resultDiv = document.getElementById("result");
    if (resultDiv && resultDiv.querySelector('.error-message')) {
        resultDiv.innerHTML = "";
    }
}

// Validação para dropdown+input (country ou zone)
function validarDropdown(inputId, listId, erroMsg) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (!input || !list) return;

    input.addEventListener('blur', function() {
        const valorInput = normalizarTexto(this.value);
        const opcoes = Array.from(list.querySelectorAll('a'));
        let encontrada = opcoes.find(opt => normalizarTexto(opt.textContent) === valorInput);

        if (this.value.trim() === "") {
            esconderErroNoResult();
            return;
        }

        if (encontrada) {
            this.value = encontrada.textContent; // Assume grafia correta do dropdown
            esconderErroNoResult();
        } else {
            mostrarErroNoResult(erroMsg);
            this.value = '';
        }
    });

    input.addEventListener('input', function() {
        esconderErroNoResult();
    });
}

// Países
validarDropdown(
    'country',
    'country-list',
    'Nenhum país disponível com esse nome. Selecione um país válido da lista.'
);
// Zonas
validarDropdown(
    'zone',
    'zone-list',
    'Nenhuma zona disponível com esse valor. Selecione uma zona válida da lista.'
);
