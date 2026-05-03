document.addEventListener("DOMContentLoaded", () => {

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
    }

    // ===== DROPDOWN PÁGINAS =====
    const btnPaginas = document.getElementById("btnPaginas");
    const submenuPaginas = document.getElementById("submenuPaginas");

    if (btnPaginas && submenuPaginas) {
        btnPaginas.addEventListener("click", (e) => {
            e.preventDefault();
            submenuPaginas.style.display =
                submenuPaginas.style.display === "block" ? "none" : "block";
        });
    }

    // ===== DROPDOWN GITHUB (páginas que ainda o têm) =====
    const btnMenu = document.getElementById("btnMenu");
    const submenu = document.getElementById("submenu");

    if (btnMenu && submenu) {
        btnMenu.addEventListener("click", (e) => {
            e.preventDefault();
            submenu.style.display =
                submenu.style.display === "block" ? "none" : "block";
        });
    }

    // Fechar dropdowns ao clicar fora
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown")) {
            if (submenu) submenu.style.display = "none";
            if (submenuPaginas) submenuPaginas.style.display = "none";
        }
    });

    // ===== AJAX — Conexão com API FramptSolutions =====
    fetch("https://localhost:7189/api/Produto/validos")
        .then(res => res.json())
        .then(produtos => {
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