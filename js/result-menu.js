// Result Menu Dropdown Controller

// Mostra o menu de opções de resultado (após cálculo)
function mostrarResultMenu() {
    document.getElementById('result-menu-container').style.display = 'inline-block';
}

// Esconde o menu de opções de resultado (ex: ao reset)
function esconderResultMenu() {
    document.getElementById('result-menu-container').style.display = 'none';
    document.getElementById('resultDropdownMenu').classList.remove('show');
}

// Toggle do dropdown
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('resultMenuBtn');
    const menu = document.getElementById('resultDropdownMenu');
    if (!btn) return;

    btn.onclick = function(e) {
        e.stopPropagation();
        menu.classList.toggle('show');
    };

    // Fecha o menu se clicar fora
    document.addEventListener('click', function() {
        menu.classList.remove('show');
    });
});

// Exemplo de funções de ação
function exportarPDF() {
    alert('Exportar para PDF (a implementar)');
}
function partilharResultado() {
    alert('Partilhar resultado (a implementar)');
}

// Torna as funções globais (caso sejam chamadas inline no HTML)
window.exportarPDF = exportarPDF;
window.partilharResultado = partilharResultado;
window.mostrarResultMenu = mostrarResultMenu;
window.esconderResultMenu = esconderResultMenu;
