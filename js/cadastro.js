document.addEventListener("DOMContentLoaded", () => {

    // ===== FOTO DO PRODUTO =====
    const fotoBox = document.getElementById("fotoBox");
    const fotoInput = document.getElementById("fotoInput");

    if (fotoBox && fotoInput) {
        fotoBox.addEventListener("click", () => fotoInput.click());
        fotoInput.addEventListener("change", () => {
            if (fotoInput.files.length > 0) {
                fotoBox.textContent = "✅ " + fotoInput.files[0].name;
            }
        });
    }

    const msg = document.getElementById("msgCadastro");


    // ===== FORMULÁRIO PRODUTO — salva na API =====
    const formProduto = document.getElementById("formProduto");
    if (formProduto) {
        formProduto.addEventListener("submit", (e) => {
            e.preventDefault();

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

    // ===== CANCELAR =====
    const btnCancelar = document.getElementById("btnCancelarProduto");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

});