document.addEventListener("DOMContentLoaded", () => {

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

    // ===== DADOS — carregados da API =====
    let dadosMovimento = [];
    let dadosDoacoes = [];

    // ===== FILTRO ENTRADA / SAÍDA / AMBOS =====
    // ===== FILTRO ENTRADA / SAÍDA / AMBOS =====
    const tbody = document.querySelector("#aba-entrada-saida table tbody");
    const ctxES = document.getElementById("graficoEntradaSaida");
    let graficoES = null;

    function renderizarTabela(filtro) {
        tbody.innerHTML = "";

        const dadosFiltrados = filtro === "ambos"
            ? dadosMovimento
            : dadosMovimento.filter(d => d.tipo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === filtro);

        dadosFiltrados.forEach(d => {
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

        atualizarGraficoEntradaSaida(dadosFiltrados);
    }

    document.querySelectorAll("input[name='movimento']").forEach(radio => {
        radio.addEventListener("change", () => {
            renderizarTabela(radio.value);
        });
    });

    renderizarTabela("entrada");

    // ===== FILTRO DE DATA NAS DOAÇÕES =====
    const tbodyDoacoes = document.querySelector("#aba-doacoes table tbody");

    function renderizarDoacoes(dataSelecionada) {
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

    renderizarDoacoes(null);

    // ===== CARREGAR DADOS REAIS DA API =====
    PedidoAPI.movimentos()
        .then(dados => {
            dadosMovimento = dados;
            // Renderiza com o filtro atual
            const filtroAtual = document.querySelector("input[name='movimento']:checked");
            renderizarTabela(filtroAtual ? filtroAtual.value : "entrada");
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
        const labels = dados.map(d => d.produto);
        const valores = dados.map(d => d.quantidade);
        const cores = dados.map(d => d.tipo === "Entrada" ? "#2563EB" : "#F59E0B");

        if (graficoES) graficoES.destroy();

        if (ctxES) {
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
    }

    // ===== GRÁFICO: PRODUTOS MAIS SOLICITADOS — dados reais da API =====
    const ctxProd = document.getElementById("graficoProdutos");

    PedidoAPI.estatisticas()
        .then(dados => {
            if (!ctxProd || dados.length === 0) return;

            const labels = dados.map(d => d.produto);
            const valores = dados.map(d => d.quantidade);
            const cores = ["#2563EB", "#F59E0B", "#16a34a", "#dc2626", "#7c3aed"];

            // Atualiza também a tabela de mais solicitados
            const tbody = document.querySelector("#aba-mais-solicitados table tbody");
            if (tbody) {
                tbody.innerHTML = "";
                dados.forEach(d => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                    <td>${d.produto}</td>
                    <td>${d.total}x</td>
                    <td>${d.quantidade}</td>
                `;
                    tbody.appendChild(tr);
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
        .catch(() => {
            console.log("API offline — gráfico de produtos não carregado.");
        });

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
            if (!tabelaAtiva) { alert("Nenhuma tabela para exportar."); return; }

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