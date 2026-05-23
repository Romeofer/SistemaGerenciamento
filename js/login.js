document.addEventListener("DOMContentLoaded", () => {

    const modalLogin = document.getElementById("modalLogin");
    const btnFechar = document.getElementById("btnFecharModal");
    const abaLogin = document.getElementById("abaLogin");
    const abaCadastro = document.getElementById("abaCadastro");
    const formLogin = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastro");
    const modalTitulo = document.getElementById("modalTitulo");
    const msgLogin = document.getElementById("msgLogin");

    let tipoSelecionado = "Usuario";

    // Abrir modal ao clicar em qualquer card
    ["cardUsuario", "cardFarmaceutico"].forEach(id => {
        const card = document.getElementById(id);
        if (card) {
            card.addEventListener("click", () => {
                tipoSelecionado = card.querySelector("h3").textContent.trim();
                modalTitulo.textContent = "Login — " + tipoSelecionado;
                modalLogin.classList.add("ativo");
                msgLogin.textContent = "";
            });
        }
    });

    // Fechar modal
    btnFechar.addEventListener("click", () => {
        modalLogin.classList.remove("ativo");
    });

    modalLogin.addEventListener("click", (e) => {
        if (e.target === modalLogin) {
            modalLogin.classList.remove("ativo");
        }
    });

    // Alternar abas
    abaLogin.addEventListener("click", () => {
        abaLogin.classList.add("ativo");
        abaCadastro.classList.remove("ativo");
        formLogin.style.display = "flex";
        formCadastro.style.display = "none";
        msgLogin.textContent = "";
    });

    abaCadastro.addEventListener("click", () => {
        abaCadastro.classList.add("ativo");
        abaLogin.classList.remove("ativo");
        formCadastro.style.display = "flex";
        formLogin.style.display = "none";
        msgLogin.textContent = "";
    });

    // ===== SUBMIT LOGIN =====
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("emailLogin").value;
        const senha = document.getElementById("senhaLogin").value;

        msgLogin.style.color = "gray";
        msgLogin.textContent = "🔄 Verificando...";

        fetch("https://localhost:7189/api/Usuario/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        })
            .then(res => {
                if (!res.ok) throw new Error("Credenciais inválidas");
                return res.json();
            })
            .then(data => {
                // Salva o token e os dados do usuário
                localStorage.setItem("token", data.token);
                localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));

                msgLogin.style.color = "green";
                msgLogin.textContent = "✅ Login realizado com sucesso! Bem-vindo, " + data.usuario.nome + "!";
                formLogin.reset();

                // Salva status dos pedidos para notificações
                PedidoAPI.buscarPorUsuario(data.usuario.id)
                    .then(pedidos => {
                        const statusMap = {};
                        pedidos.forEach(p => { statusMap[p.id] = p.status; });
                        localStorage.setItem("statusPedidos", JSON.stringify(statusMap));
                    })
                    .catch(() => { });
            })
            .catch(() => {
                msgLogin.style.color = "red";
                msgLogin.textContent = "❌ Email ou senha incorretos.";
            });
    });

    // ===== SUBMIT CADASTRO =====
    formCadastro.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuario = {
            nome: document.getElementById("nomeReg").value,
            idade: parseInt(document.getElementById("idadeReg").value),
            email: document.getElementById("emailReg").value,
            senha: document.getElementById("senhaReg").value,
            tipo: tipoSelecionado.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            telefone: null,
            cep: document.getElementById("cepReg").value || null,
            cidade: document.getElementById("cidadeReg").value || null,
            bairro: document.getElementById("bairroReg").value || null,
            logradouro: document.getElementById("logradouroReg").value || null
        };

        msgLogin.style.color = "gray";
        msgLogin.textContent = "🔄 Cadastrando...";

        UsuarioAPI.criar(usuario)
            .then(() => {
                msgLogin.style.color = "green";
                msgLogin.textContent = "✅ Cadastro realizado com sucesso! Faça o login.";
                formCadastro.reset();
                abaLogin.click();
            })
            .catch(() => {
                msgLogin.style.color = "red";
                msgLogin.textContent = "❌ Erro ao cadastrar. Verifique se a API está rodando.";
            });
    });
});