// Mostra o menu de opções de resultado (após cálculo)
function mostrarResultMenu() {
    document.getElementById('result-menu-container').style.display = 'inline-block';
}

// Esconde o menu de opções de resultado (ex: ao reset/início)
function esconderResultMenu() {
    document.getElementById('result-menu-container').style.display = 'none';
    document.getElementById('resultDropdownMenu').classList.remove('show');
}

// Dropdown toggle
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('resultMenuBtn');
    const menu = document.getElementById('resultDropdownMenu');
    if (!btn) return;
    btn.onclick = function(e) {
        e.stopPropagation();
        menu.classList.toggle('show');
    };
    document.addEventListener('click', function() {
        menu.classList.remove('show');
    });
});

// Exemplo de funções de ação
function compararResultados() { alert('Comparar resultado (a implementar)'); }
function enviarResultadoPorEmail() { alert('Enviar por email (a implementar)'); }
function exportarResultado() { alert('Exportar resultado (a implementar)'); }
window.compararResultados = compararResultados;
window.enviarResultadoPorEmail = enviarResultadoPorEmail;
window.exportarResultado = exportarResultado;
window.mostrarResultMenu = mostrarResultMenu;
window.esconderResultMenu = esconderResultMenu;
