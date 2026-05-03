document.addEventListener("DOMContentLoaded", () => {

    const modalLogin   = document.getElementById("modalLogin");
    const btnFechar    = document.getElementById("btnFecharModal");
    const abaLogin     = document.getElementById("abaLogin");
    const abaCadastro  = document.getElementById("abaCadastro");
    const formLogin    = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastro");
    const modalTitulo  = document.getElementById("modalTitulo");
    const msgLogin     = document.getElementById("msgLogin");

    let tipoSelecionado = "Doador";

    // Abrir modal ao clicar em qualquer card
    ["cardDoador", "cardSolicitante", "cardFarmaceutico"].forEach(id => {
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

    // ===== SUBMIT LOGIN — verifica se usuário existe na API =====
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("emailLogin").value;
        const senha = document.getElementById("senhaLogin").value;

        msgLogin.style.color = "gray";
        msgLogin.textContent = "🔄 Verificando...";

        UsuarioAPI.listar()
            .then(usuarios => {
                const usuario = usuarios.find(u =>
                    u.email === email && u.senha === senha
                );

                if (usuario) {
                    // Salva o usuário logado no localStorage
                    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                    msgLogin.style.color = "green";
                    msgLogin.textContent = "✅ Login realizado com sucesso! Bem-vindo, " + usuario.nome + "!";
                    formLogin.reset();
                } else {
                    msgLogin.style.color = "red";
                    msgLogin.textContent = "❌ Email ou senha incorretos.";
                }
            })
            .catch(() => {
                msgLogin.style.color = "red";
                msgLogin.textContent = "❌ Erro ao conectar com o servidor. Verifique se a API está rodando.";
            });
    });

    // ===== SUBMIT CADASTRO — salva novo usuário na API =====
    formCadastro.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuario = {
            nome:     document.getElementById("nomeReg").value,
            idade:    parseInt(document.getElementById("idadeReg").value),
            email:    document.getElementById("emailReg").value,
            senha:    document.getElementById("senhaReg").value,
            tipo: tipoSelecionado.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            telefone: null
        };

        msgLogin.style.color = "gray";
        msgLogin.textContent = "🔄 Cadastrando...";

        UsuarioAPI.criar(usuario)
            .then(() => {
                msgLogin.style.color = "green";
                msgLogin.textContent = "✅ Cadastro realizado com sucesso! Faça o login.";
                formCadastro.reset();

                // Volta para a aba de login
                abaLogin.click();
            })
            .catch(() => {
                msgLogin.style.color = "red";
                msgLogin.textContent = "❌ Erro ao cadastrar. Verifique se a API está rodando.";
            });
    });

});