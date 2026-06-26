const botao = document.getElementById("botao");
const mensagem = document.getElementById("mensagem");

botao.addEventListener("click", () => {
    mensagem.style.display = "block";
    mensagem.innerHTML = `
        <strong>Atualização:</strong><br><br>
        Esta reportagem faz parte de um projeto fictício de HTML, CSS e JavaScript.
        O vírus "Paraochão" não existe e nenhum dos acontecimentos descritos ocorreu
        na vida real.
    `;
});
