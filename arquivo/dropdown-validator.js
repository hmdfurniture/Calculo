// --- dropdown-validator.js ---
// Valida country e zone: só aceita opções do dropdown, ignora acentos/maiúsculas/ç, e mostra mensagem clara no #error-message

function normalizarTexto(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/ç/g, 'c') // trata ç como c
        .replace(/[^a-z0-9\s]/gi, '') // remove outros caracteres especiais (opcional)
        .trim();
}

// Mostra mensagem de erro global no #result
function mostrarErroNoResult(msg) {
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
        resultDiv.innerHTML = `<p class="error-message">${msg}</p>`;
    }
}

// Esconde mensagem de erro em #result (só limpa se for erro, não limpa resultados válidos)
function esconderErroNoResult() {
    const resultDiv = document.getElementById("result");
    if (resultDiv && resultDiv.querySelector('.error-message')) {
        resultDiv.innerHTML = "";
    }
}

// Validação genérica para dropdown+input (country ou zone)
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
