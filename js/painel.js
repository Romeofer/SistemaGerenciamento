document.addEventListener("DOMContentLoaded", () => {

    // ===== VERIFICAR SE É FARMACÊUTICO =====
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const tipoNormalizado = usuarioLogado?.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!usuarioLogado || tipoNormalizado !== "Farmaceutico") {
        document.getElementById("painelFarmaceutico").style.display = "none";
        document.getElementById("acessoNegado").style.display = "block";
        return;
    }

    // ===== ABAS =====
    const abasBtns = document.querySelectorAll(".aba-btn");
    const abasConteudo = document.querySelectorAll(".aba-conteudo");

    abasBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            abasBtns.forEach(b => b.classList.remove("ativo"));
            abasConteudo.forEach(c => c.classList.remove("ativo"));
            btn.classList.add("ativo");
            document.getElementById("aba-" + btn.dataset.aba).classList.add("ativo");
        });
    });

    const msg = document.getElementById("msgPainel");

    // ===== CARREGAR PEDIDOS =====
    function carregarPedidos() {
        PedidoAPI.listar()
            .then(pedidos => {
                const analise = pedidos.filter(p => p.status === "Em Analise");
                const aprovados = pedidos.filter(p => p.status === "Aprovado");
                const reprovados = pedidos.filter(p => p.status === "Reprovado");

                renderizarAnalise(analise);
                renderizarSimples("tbodyAprovados", aprovados, 5);
                renderizarSimples("tbodyReprovados", reprovados, 5);
            })
            .catch(() => {
                msg.style.color = "red";
                msg.textContent = "❌ Erro ao carregar pedidos. Verifique se a API está rodando.";
            });
    }

    // ===== RENDERIZAR TABELA EM ANÁLISE (com botões) =====
    function renderizarAnalise(pedidos) {
        const tbody = document.getElementById("tbodyAnalise");
        tbody.innerHTML = "";

        if (pedidos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nenhum pedido em análise.</td></tr>`;
            return;
        }

        pedidos.forEach(p => {
            const tr = document.createElement("tr");
            const data = new Date(p.criadoEm).toLocaleDateString("pt-BR");
            tr.innerHTML = `
                <td>${p.produto?.nome ?? "N/A"}</td>
                <td>${p.quantidade}</td>
                <td>${p.usuario?.nome ?? "N/A"}</td>
                <td>${p.descricao ?? "—"}</td>
                <td>${data}</td>
                <td style="display:flex; gap:0.5rem;">
                    <button class="btn-salvar" data-id="${p.id}" data-acao="Aprovado">✅ Aprovar</button>
                    <button class="btn-cancelar" data-id="${p.id}" data-acao="Reprovado">❌ Reprovar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Eventos dos botões
        tbody.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const acao = btn.dataset.acao;

                PedidoAPI.atualizarStatus(id, acao)
                    .then(() => {
                        msg.style.color = "green";
                        msg.textContent = `✅ Pedido ${acao === "Aprovado" ? "aprovado" : "reprovado"} com sucesso!`;
                        setTimeout(() => { msg.textContent = ""; }, 3000);
                        carregarPedidos();
                    })
                    .catch(() => {
                        msg.style.color = "red";
                        msg.textContent = "❌ Erro ao atualizar pedido.";
                    });
            });
        });
    }

    // ===== RENDERIZAR TABELAS SIMPLES (aprovados/reprovados) =====
    function renderizarSimples(tbodyId, pedidos, colunas) {
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = "";

        if (pedidos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${colunas}" style="text-align:center;">Nenhum pedido encontrado.</td></tr>`;
            return;
        }

        pedidos.forEach(p => {
            const tr = document.createElement("tr");
            const data = new Date(p.criadoEm).toLocaleDateString("pt-BR");
            const statusClass = p.status === "Aprovado" ? "status-aprovado" : "status-reprovado";
            tr.innerHTML = `
                <td>${p.produto?.nome ?? "N/A"}</td>
                <td>${p.quantidade}</td>
                <td>${p.usuario?.nome ?? "N/A"}</td>
                <td>${data}</td>
                <td><span class="badge-status ${statusClass}">${p.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    carregarPedidos();

});