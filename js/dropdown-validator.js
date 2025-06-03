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
// Recebe agora o filtro respetivo como 4º parâmetro!
function validarDropdown(inputId, listId, erroMsg, filterFn) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (!input || !list) return;

    input.addEventListener('blur', function() {
        const valorInput = normalizarTexto(this.value);
        const opcoes = Array.from(list.querySelectorAll('a'));
        let encontrada = opcoes.find(opt => normalizarTexto(opt.textContent) === valorInput);

        if (this.value.trim() === "") {
            esconderErroNoResult();
            filterFn(); // Mostra todas as opções se o campo ficou vazio
            return;
        }

        if (encontrada) {
            this.value = encontrada.textContent; // Assume grafia correta do dropdown
            esconderErroNoResult();
            // Chama o mesmo fluxo de seleção do dropdown para garantir consistência
            if (inputId === 'country') {
                selectCountry(encontrada.textContent);
            }
            if (inputId === 'zone') {
                selectZone(encontrada.textContent);
            }
        } else {
            mostrarErroNoResult(erroMsg);
            this.value = '';
            filterFn(); // Força reset visual do dropdown para mostrar tudo
            // Opcional: limpar mapas e estado dependente aqui, se necessário
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
    'Nenhum país disponível com esse nome. Selecione um país válido da lista.',
    filterCountries // <- Passa a função de filtro do país
);
// Zonas
validarDropdown(
    'zone',
    'zone-list',
    'Nenhuma zona disponível com esse valor. Selecione uma zona válida da lista.',
    filterZones // <- Passa a função de filtro da zona
);
