let supplierData = [];
let tables = []; // Guardar todos os JSONs carregados aqui

function loadSupplierData() {
    // Adapte se quiser carregar mais tabelas: só adicionar mais fetchs neste array!
    Promise.all([
        fetch('./Tables/xbslog_international.json').then((response) => response.json()),
        fetch('./Tables/xbslog_nacional.json').then((response) => response.json())
        // Exemplo de novo ficheiro: fetch('./Tables/novatabela.json').then(r=>r.json())
    ])
    .then((loadedTables) => {
        tables = loadedTables; // Guardar para cálculo dinâmico
        // supplierData serve apenas para dropdowns! Junta destinos de todas as tabelas
        supplierData = loadedTables.flatMap(table => table.destinations);
        // Chamar dropdowns
        populateCountryDropdown();
    })
    .catch((error) => console.error('Error loading supplier data:', error));
}

// Opcional: função para saber se é internacional (ajuste consoante a tua lógica real de tabelas)
function isInternational(country, zone) {
    // Exemplo para distinguir: verifica se algum destino tem rate "<500kgs"
    return supplierData.some(
        (item) => item.country === country && item.code === zone && item.rates["<500kgs"] !== undefined
    );
}
