document.addEventListener("DOMContentLoaded", () => {

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        window.location.href = "login.html";
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

            // Recarregar gráficos/ tabelas quando mudar de aba
            if (btn.dataset.aba === "entrada-saida") {
                aplicarFiltroMovimento();
            }
        });
    });

    // ===== DADOS =====
    let dadosMovimento = [];
    let dadosDoacoes = [];

    // ===== PAGINAÇÃO PARA ENTRADA/SAÍDA =====
    const ITENS_POR_PAGINA = 10;
    let movimentosPaginaAtual = 1;
    let movimentosFiltrados = [];

    const btnAnteriorMov = document.getElementById("btnAnteriorMov");
    const btnProximoMov = document.getElementById("btnProximoMov");
    const infoPaginaMov = document.getElementById("infoPaginaMov");

    const tbody = document.querySelector("#aba-entrada-saida table tbody");
    const ctxES = document.getElementById("graficoEntradaSaida");
    let graficoES = null;

    // ===== RENDERIZAR TABELA COM PAGINAÇÃO =====
    function renderizarTabelaMovimentos() {
        if (!tbody) return;

        const inicio = (movimentosPaginaAtual - 1) * ITENS_POR_PAGINA;
        const fim = inicio + ITENS_POR_PAGINA;
        const pagina = movimentosFiltrados.slice(inicio, fim);
        const total = movimentosFiltrados.length;

        tbody.innerHTML = "";

        if (total === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum movimento encontrado.</td></tr>`;
            if (infoPaginaMov) infoPaginaMov.textContent = "";
            if (btnAnteriorMov) btnAnteriorMov.disabled = true;
            if (btnProximoMov) btnProximoMov.disabled = true;
            return;
        }

        pagina.forEach(d => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${d.data}</td>
                <td>${d.produto}</td>
                <td>${d.tipo}</td>
                <td>${d.quantidade}</td>
                <td>${d.responsavel}</td>
            `;
            tbody.appendChild(tr);
        });

        const totalPaginas = Math.ceil(total / ITENS_POR_PAGINA);
        if (infoPaginaMov) {
            infoPaginaMov.textContent = `Página ${movimentosPaginaAtual} de ${totalPaginas} (${total} movimentos)`;
        }
        if (btnAnteriorMov) btnAnteriorMov.disabled = movimentosPaginaAtual === 1;
        if (btnProximoMov) btnProximoMov.disabled = movimentosPaginaAtual === totalPaginas;
    }

    // ===== APLICAR FILTRO E ATUALIZAR PAGINAÇÃO =====
    function aplicarFiltroMovimento() {
        const filtroSelecionado = document.querySelector("input[name='movimento']:checked");
        const filtro = filtroSelecionado ? filtroSelecionado.value : "entrada";

        movimentosFiltrados = filtro === "ambos"
            ? [...dadosMovimento]
            : dadosMovimento.filter(d => d.tipo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === filtro);

        movimentosPaginaAtual = 1;
        renderizarTabelaMovimentos();
        atualizarGraficoEntradaSaida(movimentosFiltrados);
    }

    // ===== EVENTOS DOS FILTROS =====
    document.querySelectorAll("input[name='movimento']").forEach(radio => {
        radio.addEventListener("change", () => {
            aplicarFiltroMovimento();
        });
    });

    // ===== EVENTOS DE PAGINAÇÃO =====
    if (btnAnteriorMov) {
        btnAnteriorMov.addEventListener("click", () => {
            if (movimentosPaginaAtual > 1) {
                movimentosPaginaAtual--;
                renderizarTabelaMovimentos();
            }
        });
    }

    if (btnProximoMov) {
        btnProximoMov.addEventListener("click", () => {
            const totalPaginas = Math.ceil(movimentosFiltrados.length / ITENS_POR_PAGINA);
            if (movimentosPaginaAtual < totalPaginas) {
                movimentosPaginaAtual++;
                renderizarTabelaMovimentos();
            }
        });
    }

    // ===== FILTRO DE DATA NAS DOAÇÕES =====
    const tbodyDoacoes = document.querySelector("#aba-doacoes table tbody");

    function renderizarDoacoes(dataSelecionada) {
        if (!tbodyDoacoes) return;

        tbodyDoacoes.innerHTML = "";

        const dadosFiltrados = (!dataSelecionada || dataSelecionada === "")
            ? dadosDoacoes
            : dadosDoacoes.filter(d => d.data === dataSelecionada);

        if (dadosFiltrados.length === 0) {
            tbodyDoacoes.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhuma doação encontrada para essa data.</td></tr>`;
            return;
        }

        dadosFiltrados.forEach(d => {
            const tr = document.createElement("tr");
            const dataFormatada = new Date(d.data + "T00:00:00").toLocaleDateString("pt-BR");
            tr.innerHTML = `
                <td>${d.doador}</td>
                <td>${d.produto}</td>
                <td>${d.quantidade}</td>
                <td>${dataFormatada}</td>
            `;
            tbodyDoacoes.appendChild(tr);
        });
    }

    const inputDataDoacoes = document.getElementById("periodoDoacoes");
    if (inputDataDoacoes) {
        inputDataDoacoes.addEventListener("change", () => {
            renderizarDoacoes(inputDataDoacoes.value);
        });
    }

    // ===== CARREGAR DADOS DA API =====
    PedidoAPI.movimentosCorrigido()
        .then(dados => {
            dadosMovimento = dados;
            aplicarFiltroMovimento();
        })
        .catch(() => console.log("API offline — usando dados vazios."));

    DoacaoAPI.relatorio()
        .then(dados => {
            dadosDoacoes = dados;
            renderizarDoacoes(null);
        })
        .catch(() => console.log("API offline — usando dados vazios."));

    // ===== GRÁFICO: ENTRADA E SAÍDA =====
    function atualizarGraficoEntradaSaida(dados) {
        if (!ctxES) return;

        const labels = dados.map(d => d.produto);
        const valores = dados.map(d => d.quantidade);
        const cores = dados.map(d => d.tipo === "Entrada" ? "#2563EB" : "#F59E0B");

        if (graficoES) graficoES.destroy();

        graficoES = new Chart(ctxES, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Quantidade",
                    data: valores,
                    backgroundColor: cores,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // ===== GRÁFICO: PRODUTOS MAIS SOLICITADOS =====
    const ctxProd = document.getElementById("graficoProdutos");

    PedidoAPI.estatisticas()
        .then(dados => {
            if (!ctxProd || !dados || dados.length === 0) return;

            const labels = dados.map(d => d.produto);
            const valores = dados.map(d => d.quantidade);
            const cores = ["#2563EB", "#F59E0B", "#16a34a", "#dc2626", "#7c3aed", "#db2777", "#4b5563"].slice(0, dados.length);

            const tbodyMaisSolicitados = document.querySelector("#aba-mais-solicitados table tbody");
            if (tbodyMaisSolicitados) {
                tbodyMaisSolicitados.innerHTML = "";
                dados.forEach(d => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `<td>${d.produto}</td><td>${d.total}x</td><td>${d.quantidade}</td>`;
                    tbodyMaisSolicitados.appendChild(tr);
                });
            }

            new Chart(ctxProd, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: cores,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: "bottom" } }
                }
            });
        })
        .catch(() => console.log("API offline — gráfico de produtos não carregado."));

    // ===== BOTÃO GERAR RELATÓRIO =====
    const btnGerar = document.getElementById("btnGerarRel");
    if (btnGerar) {
        btnGerar.addEventListener("click", () => {
            alert("Relatório gerado com sucesso!");
        });
    }

    // ===== BOTÃO EXPORTAR CSV =====
    const btnExportar = document.getElementById("btnExportarCSV");
    if (btnExportar) {
        btnExportar.addEventListener("click", () => {
            const tabelaAtiva = document.querySelector(".aba-conteudo.ativo table");
            if (!tabelaAtiva) {
                alert("Nenhuma tabela para exportar.");
                return;
            }

            let csv = "";
            tabelaAtiva.querySelectorAll("tr").forEach(tr => {
                const cols = [...tr.querySelectorAll("th, td")].map(c => `"${c.textContent.trim()}"`);
                csv += cols.join(",") + "\n";
            });

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "relatorio.csv";
            link.click();
            URL.revokeObjectURL(url);
        });
    }
});