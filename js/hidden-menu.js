function compararResultados() {
    alert('Função Comparar ainda não implementada');
}

function pedirOrcamento() {
    alert('Função Pedir Orçamento ainda não implementada');
}

function imprimirResultados() {
    // Adiciona a classe ao body para ativar o CSS de impressão específico
    document.body.classList.add('print-calculo');
    // Aguarda um pouco para o CSS aplicar (garante em certos browsers)
    setTimeout(function() {
        window.print();
        // Remove a classe após imprimir (garante que não afeta navegação normal)
        document.body.classList.remove('print-calculo');
    }, 100);
}

function enviarPorEmail() {
    const resultadosHtml = document.getElementById("result").innerText;
    const subject = encodeURIComponent("Resultados do Cálculo");
    const body = encodeURIComponent("Aqui estão os resultados:\n\n" + resultadosHtml);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
