// Funções para mostrar/esconder o botão dos três pontos
function showMoreBtn() {
    document.getElementById('moreBtn').classList.remove('hidden');
}
function hideMoreBtn() {
    document.getElementById('moreBtn').classList.add('hidden');
    document.getElementById('moreMenu').classList.remove('show');
}

// Mostra/oculta o dropdown
document.getElementById('moreBtn').onclick = function(e) {
    e.stopPropagation();
    const menu = document.getElementById('moreMenu');
    menu.classList.toggle('show');
    document.getElementById('hamburgerMenu').classList.remove('show');
    document.getElementById('avatarMenu').classList.remove('show');
};

// Fecha dropdowns ao clicar fora
document.addEventListener('click', function() {
    document.getElementById('moreMenu').classList.remove('show');
});
