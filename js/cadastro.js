document.addEventListener("DOMContentLoaded", () => {

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const tipoNormalizado = usuarioLogado?.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!usuarioLogado || tipoNormalizado !== "Farmaceutico") {
        window.location.href = "login.html";
        return;
    }

    const fotoBox = document.getElementById("fotoBox");
    const fotoInput = document.getElementById("fotoInput");
    if (fotoBox && fotoInput) {
        fotoBox.addEventListener("click", () => fotoInput.click());
        fotoInput.addEventListener("change", () => {
            if (fotoInput.files.length > 0) fotoBox.textContent = "✅ " + fotoInput.files[0].name;
        });
    }

    const msg = document.getElementById("msgCadastro");
    const formProduto = document.getElementById("formProduto");
    if (formProduto) {
        formProduto.addEventListener("submit", (e) => {
            e.preventDefault();

            const validadeInput = document.getElementById("validadeProduto").value;
            if (validadeInput) {
                const dataValidade = new Date(validadeInput);
                const dataHoje = new Date();
                dataHoje.setHours(0, 0, 0, 0);
                if (dataValidade < dataHoje) {
                    msg.style.color = "red";
                    msg.textContent = "❌ Não é possível cadastrar um produto com data de validade vencida.";
                    return;
                }
            }

            const produto = {
                nome: document.getElementById("nomeProduto").value.trim().toLowerCase().replace(/^\w/, c => c.toUpperCase()),
                descricao: document.getElementById("outrasInfos").value,
                estado: document.getElementById("estadoProduto").value,
                validade: document.getElementById("validadeProduto").value || null
            };

            msg.style.color = "gray";
            msg.textContent = "🔄 Cadastrando produto...";

            ProdutoAPI.criar(produto)
                .then(() => {
                    msg.style.color = "green";
                    msg.textContent = "✅ Produto cadastrado com sucesso!";
                    formProduto.reset();
                    if (fotoBox) fotoBox.textContent = "📷";
                })
                .catch(() => {
                    msg.style.color = "red";
                    msg.textContent = "❌ Erro ao cadastrar produto. Verifique se a API está rodando.";
                });
        });
    }

    const btnCancelar = document.getElementById("btnCancelarProduto");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => window.location.href = "login.html");
    }
});