document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formSolicitacao");
    const tabela = document.querySelector("#tabelaPedidos tbody");
    const msg = document.getElementById("msgSolicitacao");

    // ===== FOTO DO LAUDO =====
    const laudoBox = document.getElementById("laudoBox");
    const laudoInput = document.getElementById("laudoSolic");

    if (laudoBox && laudoInput) {
        laudoBox.addEventListener("click", () => laudoInput.click());
        laudoInput.addEventListener("change", () => {
            if (laudoInput.files.length > 0) {
                laudoBox.textContent = "✅ " + laudoInput.files[0].name;
            }
        });
    }

    // ===== CARREGAR PEDIDOS DO BANCO =====
    function carregarPedidos() {
        PedidoAPI.listar()
            .then(pedidos => {
                tabela.innerHTML = "";

                if (pedidos.length === 0) {
                    tabela.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum pedido encontrado.</td></tr>`;
                    return;
                }

                pedidos.forEach(p => {
                    const tr = document.createElement("tr");
                    const statusClass =
                        p.status === "Aprovado" ? "status-aprovado" :
                            p.status === "Reprovado" ? "status-reprovado" : "status-analise";

                    tr.innerHTML = `
                        <td>${p.produto?.nome ?? "N/A"}</td>
                        <td>${p.quantidade}</td>
                        <td>${p.usuario?.nome ?? "N/A"}</td>
                        <td>—</td>
                        <td><span class="badge-status ${statusClass}">${p.status}</span></td>
                    `;
                    tabela.appendChild(tr);
                });
            })
            .catch(() => {
                tabela.innerHTML = `<tr><td colspan="5" style="text-align:center;">Erro ao carregar pedidos.</td></tr>`;
            });
    }

    carregarPedidos();

    // ===== CARREGAR PRODUTOS NO SELECT =====
    ProdutoAPI.listarValidos()
        .then(produtos => {
            const select = document.getElementById("produtoIdSolic");
            select.innerHTML = '<option value="">Selecione um produto...</option>';
            produtos.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.nome} — ${p.estado}</option>`;
            });

            // Quando selecionar um produto, busca o estoque e limita a quantidade
            select.addEventListener("change", () => {
                const produtoId = select.value;
                const inputQtd = document.getElementById("qtdSolic");

                if (!produtoId) {
                    inputQtd.removeAttribute("max");
                    inputQtd.placeholder = "0";
                    return;
                }

                ProdutoAPI.estoque(produtoId)
                    .then(estoque => {
                        inputQtd.max = estoque;
                        inputQtd.placeholder = `Máximo disponível: ${estoque}`;

                        if (estoque === 0) {
                            inputQtd.max = 0;
                            inputQtd.placeholder = "Produto sem estoque!";
                            inputQtd.disabled = true;
                        } else {
                            inputQtd.disabled = false;
                        }
                    });
            });
        })
        .catch(() => {
            document.getElementById("produtoIdSolic").innerHTML = '<option value="">Erro ao carregar produtos</option>';
        });

    // ===== ENVIAR PEDIDO — salva na API =====
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

            if (!usuarioLogado) {
                msg.style.color = "red";
                msg.textContent = "❌ Você precisa estar logado para fazer um pedido.";
                return;
            }

            const inputQtd = document.getElementById("qtdSolic");
            const quantidade = parseInt(inputQtd.value);
            const maxEstoque = parseInt(inputQtd.max);

            // Barramento de estoque
            if (inputQtd.disabled || quantidade < 1) {
                msg.style.color = "red";
                msg.textContent = "❌ Produto sem estoque disponível.";
                return;
            }

            if (maxEstoque && quantidade > maxEstoque) {
                msg.style.color = "red";
                msg.textContent = `❌ Quantidade máxima disponível: ${maxEstoque}.`;
                return;
            }

            const pedido = {
                usuarioId: usuarioLogado.id,
                produtoId: parseInt(document.getElementById("produtoIdSolic").value),
                quantidade: quantidade,
                descricao: document.getElementById("descricaoSolic").value,
                status: "Em Analise"
            };

            msg.style.color = "gray";
            msg.textContent = "🔄 Enviando pedido...";

            PedidoAPI.criar(pedido)
                .then(() => {
                    msg.style.color = "green";
                    msg.textContent = "✅ Pedido enviado com sucesso!";
                    form.reset();
                    if (laudoBox) laudoBox.textContent = "📄";
                    carregarPedidos();
                    setTimeout(() => { msg.textContent = ""; }, 3000);
                })
                .catch(() => {
                    msg.style.color = "red";
                    msg.textContent = "❌ Erro ao enviar pedido. Verifique se a API está rodando.";
                });
        });
    }

});