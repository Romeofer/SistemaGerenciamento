document.addEventListener("DOMContentLoaded", () => {

    // ===== VERIFICAR LOGIN =====
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        window.location.href = "login.html";
        return;
    }

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

    // ===== PAGINAÇÃO =====
    const ITENS_POR_PAGINA = 10;
    let todosPedidos = [];
    let pedidosFiltrados = [];
    let paginaAtual = 1;
    const btnAnterior = document.getElementById("btnAnterior");
    const btnProximo = document.getElementById("btnProximo");
    const infoPagina = document.getElementById("infoPagina");

    // Cache de estoque para evitar múltiplas chamadas
    let estoqueCache = {};

    async function obterEstoque(produtoId) {
        if (estoqueCache[produtoId] !== undefined) return estoqueCache[produtoId];
        try {
            const estoque = await ProdutoAPI.estoque(produtoId);
            estoqueCache[produtoId] = estoque;
            return estoque;
        } catch {
            return 0;
        }
    }

    async function renderizarPedidos() {
        tabela.innerHTML = "";
        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        const fim = inicio + ITENS_POR_PAGINA;
        const pagina = pedidosFiltrados.slice(inicio, fim);
        const total = pedidosFiltrados.length;

        if (total === 0) {
            tabela.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum pedido encontrado.</td></tr>`;
            infoPagina.textContent = "";
            btnAnterior.disabled = true;
            btnProximo.disabled = true;
            return;
        }

        // Para cada pedido, buscar estoque assincronamente
        for (const p of pagina) {
            const estoque = await obterEstoque(p.produtoId);
            const tr = document.createElement("tr");
            const statusClass = p.status === "Aprovado" ? "status-aprovado" :
                p.status === "Reprovado" ? "status-reprovado" : "status-analise";
            tr.innerHTML = `
                <td>${p.produto?.nome ?? "N/A"}</td>
                <td>${p.quantidade}</td>
                <td>${p.usuario?.nome ?? "N/A"}</td>
                <td>${estoque}</td>
                <td><span class="badge-status ${statusClass}">${p.status}</span></td>
            `;
            tabela.appendChild(tr);
        }

        const totalPaginas = Math.ceil(total / ITENS_POR_PAGINA);
        infoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas} (${total} pedidos)`;
        btnAnterior.disabled = paginaAtual === 1;
        btnProximo.disabled = paginaAtual === totalPaginas;
    }

    function filtrarPedidos(filtro) {
        pedidosFiltrados = filtro === "todos"
            ? todosPedidos
            : todosPedidos.filter(p => p.status === filtro);
        paginaAtual = 1;
        renderizarPedidos();
    }

    function carregarPedidos() {
        PedidoAPI.listar()
            .then(pedidos => {
                todosPedidos = pedidos;
                const filtroAtual = document.querySelector("input[name='filtroStatus']:checked");
                filtrarPedidos(filtroAtual ? filtroAtual.value : "todos");
            })
            .catch(() => {
                tabela.innerHTML = `<tr><td colspan="5" style="text-align:center;">Erro ao carregar pedidos.</td></tr>`;
            });
    }

    carregarPedidos();

    // Eventos de paginação
    btnAnterior.addEventListener("click", () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarPedidos();
        }
    });
    btnProximo.addEventListener("click", () => {
        const totalPaginas = Math.ceil(pedidosFiltrados.length / ITENS_POR_PAGINA);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarPedidos();
        }
    });

    // Filtro por status
    document.querySelectorAll("input[name='filtroStatus']").forEach(radio => {
        radio.addEventListener("change", () => filtrarPedidos(radio.value));
    });

    // Carregar produtos no select e verificar estoque
    ProdutoAPI.listarValidos()
        .then(produtos => {
            const select = document.getElementById("produtoIdSolic");
            select.innerHTML = '<option value="">Selecione um produto...</option>';
            produtos.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.nome} — ${p.estado}</option>`;
            });
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
                        inputQtd.disabled = (estoque === 0);
                        if (estoque === 0) inputQtd.placeholder = "Produto sem estoque!";
                    });
            });
        })
        .catch(() => {
            document.getElementById("produtoIdSolic").innerHTML = '<option value="">Erro ao carregar produtos</option>';
        });

    // Enviar pedido
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputQtd = document.getElementById("qtdSolic");
            const quantidade = parseInt(inputQtd.value);
            const maxEstoque = parseInt(inputQtd.max);
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