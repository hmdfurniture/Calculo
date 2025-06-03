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

// Mostra mensagem de erro global no #error-message
function mostrarErroGlobal(msg) {
    const erroDiv = document.getElementById("error-message");
    if (erroDiv) {
        erroDiv.innerText = msg;
        erroDiv.style.display = "block";
    }
}

// Esconde mensagem de erro global
function esconderErroGlobal() {
    const erroDiv = document.getElementById("error-message");
    if (erroDiv) {
        erroDiv.innerText = "";
        erroDiv.style.display = "none";
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
            esconderErroGlobal();
            return;
        }

        if (encontrada) {
            this.value = encontrada.textContent; // Assume grafia correta do dropdown
            esconderErroGlobal();
        } else {
            mostrarErroGlobal(erroMsg);
            this.value = '';
        }
    });

    input.addEventListener('input', function() {
        esconderErroGlobal();
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
