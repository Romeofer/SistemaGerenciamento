document.addEventListener("DOMContentLoaded", () => {

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        window.location.href = "login.html";
        return;
    }

    const form = document.getElementById("formDoacao");
    const tabela = document.querySelector("#tabelaDoacoes tbody");
    const msg = document.getElementById("msgDoacao");
    const selectProduto = document.getElementById("produtoIdDoacao");

    // ===== CARREGAR PRODUTOS NO SELECT =====
    async function carregarProdutos() {
        if (!selectProduto) return;

        selectProduto.innerHTML = '<option value="">Carregando produtos...</option>';

        try {
            const produtos = await ProdutoAPI.listarValidos();
            console.log("Produtos carregados:", produtos); // Debug

            if (!produtos || produtos.length === 0) {
                selectProduto.innerHTML = '<option value="">Nenhum produto disponível</option>';
                return;
            }

            selectProduto.innerHTML = '<option value="">Selecione um produto...</option>';
            produtos.forEach(p => {
                selectProduto.innerHTML += `<option value="${p.id}">${p.nome} — ${p.estado ?? "N/A"}</option>`;
            });
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            selectProduto.innerHTML = '<option value="">Erro ao carregar produtos</option>';
        }
    }

    // ===== CARREGAR DOAÇÕES DO USUÁRIO =====
    async function carregarDoacoes() {
        if (!tabela) return;

        tabela.innerHTML = '<tr><td colspan="5">Carregando doações...</td></tr>';

        try {
            const doacoes = await DoacaoAPI.buscarPorUsuario(usuarioLogado.id);
            console.log("Doações carregadas:", doacoes); // Debug

            if (!doacoes || doacoes.length === 0) {
                tabela.innerHTML = '<tr><td colspan="5">Nenhuma doação registrada.</td></tr>';
                return;
            }

            tabela.innerHTML = "";
            doacoes.forEach(d => {
                const tr = document.createElement("tr");
                const data = new Date(d.data).toLocaleDateString("pt-BR");
                const produto = d.lotes?.[0]?.produto?.nome ?? "N/A";
                const quantidade = d.lotes?.reduce((acc, l) => acc + l.quantidade, 0) ?? 0;
                const origem = d.lotes?.[0]?.origem ?? "—";
                const statusClass = d.status === "Recebida" ? "status-aprovado"
                    : d.status === "Cancelada" ? "status-reprovado"
                        : "status-analise";
                tr.innerHTML = `
                    <td>${produto}</td>
                    <td>${quantidade}</td>
                    <td>${origem}</td>
                    <td>${data}</td>
                    <td><span class="badge-status ${statusClass}">${d.status}</span></td>
                `;
                tabela.appendChild(tr);
            });
        } catch (error) {
            console.error("Erro ao carregar doações:", error);
            tabela.innerHTML = '<td><td colspan="5">Erro ao carregar doações.</td></tr>';
        }
    }

    // ===== REGISTRAR DOAÇÃO =====
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const produtoId = parseInt(selectProduto.value);
            const quantidade = parseInt(document.getElementById("qtdDoacao").value);
            const origem = document.getElementById("origemDoacao").value;
            const observacao = document.getElementById("obsDoacao").value;
            const validade = document.getElementById("validadeDoacao").value;

            if (!produtoId || quantidade < 1) {
                msg.style.color = "red";
                msg.textContent = "❌ Selecione um produto e informe a quantidade.";
                return;
            }

            if (quantidade > 12) {
                msg.style.color = "red";
                msg.textContent = "❌ Quantidade máxima por doação é de 12 medicamentos.";
                return;
            }

            if (validade && new Date(validade) < new Date()) {
                msg.style.color = "red";
                msg.textContent = "❌ Não é possível doar um medicamento com validade vencida.";
                return;
            }

            msg.style.color = "gray";
            msg.textContent = "🔄 Registrando doação...";

            try {
                const doacao = await DoacaoAPI.criar({
                    usuarioId: usuarioLogado.id,
                    observacao: observacao
                });

                const outrasInfos = observacao + (validade ? ` | Validade: ${validade}` : "");

                const response = await fetch(`${API_URL}/Lote`, {
                    method: "POST",
                    headers: authHeaders(),
                    body: JSON.stringify({
                        produtoId: produtoId,
                        doacaoId: doacao.id,
                        quantidade: quantidade,
                        origem: origem,
                        outrasInfos: outrasInfos
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Erro ao criar lote");
                }

                msg.style.color = "green";
                msg.textContent = "✅ Doação registrada com sucesso!";
                form.reset();
                await carregarDoacoes();
                setTimeout(() => { msg.textContent = ""; }, 3000);
            } catch (error) {
                console.error("Erro:", error);
                msg.style.color = "red";
                msg.textContent = "❌ " + (error.message || "Erro ao registrar doação.");
            }
        });
    }

    // Inicializar
    carregarProdutos();
    carregarDoacoes();
});