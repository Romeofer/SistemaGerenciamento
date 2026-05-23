document.addEventListener("DOMContentLoaded", () => {

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const tipoNormalizado = usuarioLogado?.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!usuarioLogado || tipoNormalizado !== "Farmaceutico") {
        document.getElementById("painelFarmaceutico").style.display = "none";
        document.getElementById("acessoNegado").style.display = "block";
        return;
    }

    const abasBtns = document.querySelectorAll(".aba-btn");
    const abasConteudo = document.querySelectorAll(".aba-conteudo");

    abasBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            abasBtns.forEach(b => b.classList.remove("ativo"));
            abasConteudo.forEach(c => c.classList.remove("ativo"));
            btn.classList.add("ativo");
            document.getElementById("aba-" + btn.dataset.aba).classList.add("ativo");
            if (btn.dataset.aba === "doacoes") carregarDoacoesPendentes();
        });
    });

    const msg = document.getElementById("msgPainel");

    // Paginação para pedidos
    const ITENS_POR_PAGINA = 10;
    let pedidosAnalise = [];
    let paginaAtual = 1;
    const btnAnterior = document.getElementById("btnAnteriorAnalise");
    const btnProximo = document.getElementById("btnProximoAnalise");
    const infoPagina = document.getElementById("infoPaginaAnalise");

    function renderizarAnalise() {
        const tbody = document.getElementById("tbodyAnalise");
        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        const fim = inicio + ITENS_POR_PAGINA;
        const pagina = pedidosAnalise.slice(inicio, fim);
        const total = pedidosAnalise.length;

        tbody.innerHTML = "";

        if (total === 0) {
            tbody.innerHTML = `<td><td colspan="6" style="text-align:center;">Nenhum pedido em análise.</td></tr>`;
            infoPagina.textContent = "";
            btnAnterior.disabled = true;
            btnProximo.disabled = true;
            return;
        }

        pagina.forEach(p => {
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

        const totalPaginas = Math.ceil(total / ITENS_POR_PAGINA);
        infoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas} (${total} pedidos)`;
        btnAnterior.disabled = paginaAtual === 1;
        btnProximo.disabled = paginaAtual === totalPaginas;

        tbody.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const acao = btn.dataset.acao;
                PedidoAPI.atualizarStatus(id, acao)
                    .then(() => {
                        msg.style.color = "green";
                        msg.textContent = `✅ Pedido ${acao === "Aprovado" ? "aprovado" : "reprovado"} com sucesso!`;
                        setTimeout(() => msg.textContent = "", 3000);
                        carregarPedidos();
                    })
                    .catch(() => {
                        msg.style.color = "red";
                        msg.textContent = "❌ Erro ao atualizar pedido.";
                    });
            });
        });
    }

    btnAnterior.addEventListener("click", () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarAnalise();
        }
    });

    btnProximo.addEventListener("click", () => {
        const totalPaginas = Math.ceil(pedidosAnalise.length / ITENS_POR_PAGINA);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarAnalise();
        }
    });

    function renderizarSimples(tbodyId, pedidos, colunas) {
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = "";
        if (pedidos.length === 0) {
            tbody.innerHTML = `<td><td colspan="${colunas}" style="text-align:center;">Nenhum pedido encontrado.</td></tr>`;
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

    // ===== DOAÇÕES PENDENTES =====
    async function carregarDoacoesPendentes() {
        const tbody = document.getElementById("tbodyDoacoesPendentes");
        tbody.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
        try {
            const doacoes = await DoacaoAPI.listar();
            const pendentes = doacoes.filter(d => d.status === "Pendente");
            if (pendentes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">Nenhuma doação pendente.</td></tr>';
                return;
            }
            tbody.innerHTML = "";
            for (const d of pendentes) {
                const data = new Date(d.data).toLocaleDateString("pt-BR");
                const produtos = d.lotes?.map(l => l.produto?.nome).join(", ") || "N/A";
                const qtdTotal = d.lotes?.reduce((acc, l) => acc + l.quantidade, 0) || 0;
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${d.usuario?.nome || "Anônimo"}</td>
                    <td>${produtos}</td>
                    <td>${qtdTotal}</td>
                    <td>${data}</td>
                    <td>
                        <button class="btn-salvar" data-id="${d.id}" data-acao="receber">✅ Receber</button>
                        <button class="btn-cancelar" data-id="${d.id}" data-acao="cancelar">❌ Recusar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
            document.querySelectorAll("#tbodyDoacoesPendentes button").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const id = parseInt(btn.dataset.id);
                    const acao = btn.dataset.acao;
                    try {
                        if (acao === "receber") await DoacaoAPI.receber(id);
                        else await DoacaoAPI.cancelar(id);
                        exibirNotificacao(acao === "receber" ? "Doação recebida!" : "Doação recusada!", acao === "receber" ? "sucesso" : "erro");
                        carregarDoacoesPendentes();
                        
                    } catch (err) {
                        exibirNotificacao("Erro ao processar doação.", "erro");
                    }
                });
            });
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar doações.</td></tr>';
        }
    }

    function carregarPedidos() {
        PedidoAPI.listar()
            .then(pedidos => {
                pedidosAnalise = pedidos.filter(p => p.status === "Em Analise");
                const aprovados = pedidos.filter(p => p.status === "Aprovado");
                const reprovados = pedidos.filter(p => p.status === "Reprovado");
                paginaAtual = 1;
                renderizarAnalise();
                renderizarSimples("tbodyAprovados", aprovados, 5);
                renderizarSimples("tbodyReprovados", reprovados, 5);
            })
            .catch(() => {
                msg.style.color = "red";
                msg.textContent = "❌ Erro ao carregar pedidos. Verifique se a API está rodando.";
            });
    }

    carregarPedidos();
    carregarDoacoesPendentes();

    const abaDoacoesBtn = document.querySelector("[data-aba='doacoes']");
    if (abaDoacoesBtn) abaDoacoesBtn.addEventListener("click", carregarDoacoesPendentes);
});