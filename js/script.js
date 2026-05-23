document.addEventListener("DOMContentLoaded", () => {

    // ===== APLICAR FONTE SALVA =====
    function aplicarFonteGlobal() {
        const tamanho = localStorage.getItem("fontSize") || "normal";
        const familia = localStorage.getItem("fontFamily") || "default";

        document.body.classList.remove("font-small", "font-normal", "font-large");
        document.body.classList.add(`font-${tamanho}`);

        if (familia === "default") {
            document.body.style.fontFamily = "";
        } else if (familia === "sans") {
            document.body.style.fontFamily = "Arial, Helvetica, sans-serif";
        } else if (familia === "serif") {
            document.body.style.fontFamily = "Georgia, 'Times New Roman', serif";
        } else if (familia === "mono") {
            document.body.style.fontFamily = "'Courier New', Courier, monospace";
        }
    }
    aplicarFonteGlobal();

    // ===== TEMA =====
    const botaoTema = document.getElementById("temaBtn");
    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "dark") {
        document.body.classList.add("dark");
        botaoTema.textContent = "☀️";
    } else {
        document.body.classList.remove("dark");
        botaoTema.textContent = "🌙";
    }

    botaoTema.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("tema", "dark");
            botaoTema.textContent = "☀️";
        } else {
            localStorage.setItem("tema", "light");
            botaoTema.textContent = "🌙";
        }
    });

    // ===== USUÁRIO LOGADO NO HEADER =====
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuarioLogado) {
        const nav = document.querySelector("header nav");
        if (nav) {
            const fotoSalva = localStorage.getItem("fotoPerfil");
            const spanUsuario = document.createElement("span");
            spanUsuario.id = "usuarioHeader";
            spanUsuario.style.cssText = "display:flex; align-items:center; gap:8px; color:#fff; font-size:0.9rem; font-weight:bold; white-space:nowrap;";

            if (fotoSalva) {
                const img = document.createElement("img");
                img.src = fotoSalva;
                img.style.cssText = "width:32px; height:32px; border-radius:50%; object-fit:cover; border:2px solid #fff;";
                spanUsuario.appendChild(img);
            } else {
                const icone = document.createElement("span");
                icone.textContent = "👤";
                spanUsuario.appendChild(icone);
            }

            const nome = document.createElement("span");
            nome.textContent = usuarioLogado.nome;
            spanUsuario.appendChild(nome);
            nav.parentNode.insertBefore(spanUsuario, nav);
        }
        verificarMudancasStatus(usuarioLogado.id);
    }

    // ===== DROPDOWN PÁGINAS — baseado no tipo do usuário =====
    const btnPaginas = document.getElementById("btnPaginas");
    const submenuPaginas = document.getElementById("submenuPaginas");

    if (submenuPaginas && usuarioLogado) {
        const isFarmaceutico = usuarioLogado.tipo === "Farmaceutico";

        submenuPaginas.innerHTML = isFarmaceutico
            ? `
                <li><a href="login.html">Login</a></li>
                <li><a href="cadastro.html">Cadastro</a></li>
                <li><a href="solicitacao.html">Solicitação</a></li>
                <li><a href="doacao.html">Doação</a></li>
                <li><a href="relatorio.html">Relatório</a></li>
                <li><a href="painel.html">Painel</a></li>
                <li><a href="configuracoes.html">Configurações</a></li>
            `
            : `
                <li><a href="login.html">Login</a></li>
                <li><a href="solicitacao.html">Solicitação</a></li>
                <li><a href="doacao.html">Doação</a></li>
                <li><a href="configuracoes.html">Configurações</a></li>
            `;
    }

    if (btnPaginas && submenuPaginas) {
        btnPaginas.addEventListener("click", (e) => {
            e.preventDefault();
            submenuPaginas.style.display = submenuPaginas.style.display === "block" ? "none" : "block";
        });
    }

    // ===== DROPDOWN GITHUB =====
    const btnMenu = document.getElementById("btnMenu");
    const submenu = document.getElementById("submenu");

    if (btnMenu && submenu) {
        btnMenu.addEventListener("click", (e) => {
            e.preventDefault();
            submenu.style.display = submenu.style.display === "block" ? "none" : "block";
        });
    }

    // Fechar dropdowns ao clicar fora
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown")) {
            if (submenu) submenu.style.display = "none";
            if (submenuPaginas) submenuPaginas.style.display = "none";
        }
    });

    // ===== AJAX — Conexão com API usando token =====
    const token = localStorage.getItem("token");
    fetch("https://localhost:7189/api/Produto/validos", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
    })
        .then(res => {
            if (res.status === 401) {
                console.warn("Não autorizado - faça login novamente");
                return null;
            }
            return res.json();
        })
        .then(produtos => {
            if (!produtos) return;
            const main = document.querySelector("main");
            if (!main) return;
            const div = document.createElement("div");
            div.id = "ajaxInfo";
            div.textContent = produtos.length === 0
                ? "📡 API conectada — Nenhum produto disponível no momento."
                : `📡 API conectada — ${produtos.length} produto(s) disponível(is) no estoque.`;
            main.appendChild(div);
        })
        .catch(() => { });
});