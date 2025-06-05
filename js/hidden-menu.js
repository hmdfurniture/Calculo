function compararResultados() {
    alert('Função Comparar ainda não implementada');
}

function pedirOrcamento() {
    alert('Função Pedir Orçamento ainda não implementada');
}

function imprimirResultados() {
    window.print();
}

function enviarPorEmail() {
    const resultadosHtml = document.getElementById("result").innerText;
    const subject = encodeURIComponent("Resultados do Cálculo");
    const body = encodeURIComponent("Aqui estão os resultados:\n\n" + resultadosHtml);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
