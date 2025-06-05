// Estado para o fluxo do orçamento
let orcamentoEstado = {
    userQuerOrcamento: null,
    ultimoPaisZonaValido: null
};

// Função para resetar o estado do orçamento
function resetOrcamentoEstado() {
    orcamentoEstado.userQuerOrcamento = null;
}

// Função para mostrar o modal de orçamento
function mostrarOrcamentoModal() {
    const modal = document.getElementById('orcamento-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Função para esconder o modal de orçamento
function esconderOrcamentoModal() {
    const modal = document.getElementById('orcamento-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Função para perguntar ao utilizador se quer orçamento personalizado
function perguntarOrcamentoPersonalizado() {
    // Substitui por lógica de popup customizado se tiveres
    if (confirm("Nenhuma tabela/cálculo disponível para este destino. Pretende pedir um orçamento personalizado?")) {
        orcamentoEstado.userQuerOrcamento = true;
        mostrarOrcamentoModal();
    } else {
        orcamentoEstado.userQuerOrcamento = false;
        // Aqui podes adicionar lógica para mostrar mensagem de erro, reset, etc.
    }
}

// Chama esta função ao tentar calcular com país/zona inválido
function tentarCalcularOrcamento(paisZonaValido) {
    if (paisZonaValido) {
        orcamentoEstado.ultimoPaisZonaValido = paisZonaValido;
        resetOrcamentoEstado();
        // Prossegue com o cálculo normal
    } else {
        if (orcamentoEstado.userQuerOrcamento === true) {
            mostrarOrcamentoModal();
        } else {
            perguntarOrcamentoPersonalizado();
        }
    }
}

// Chama esta função quando o utilizador introduz um país/zona não existente
function paisOuZonaInvalido() {
    perguntarOrcamentoPersonalizado();
}

// Integração com botão de reset (chama resetOrcamentoEstado)
document.addEventListener('DOMContentLoaded', function() {
    // Exemplo: botão com id "reset-btn"
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetOrcamentoEstado);
    }

    // Fechar modal no botão "Fechar"
    const fecharBtn = document.getElementById('orcamento-modal-fechar');
    if (fecharBtn) {
        fecharBtn.addEventListener('click', esconderOrcamentoModal);
    }

    // Submissão do formulário de orçamento
    const form = document.getElementById('orcamento-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aqui podes enviar via AJAX ou mailto, consoante o pretendido
            alert('Pedido de orçamento enviado!'); // Substitui por lógica real
            esconderOrcamentoModal();
            resetOrcamentoEstado();
        });
    }
});
