document.addEventListener("DOMContentLoaded", () => {

    // ===== NAVEGAÇÃO SIDEBAR =====
    const sidebarBtns = document.querySelectorAll(".config-sidebar button");
    const panels = document.querySelectorAll(".config-panel");

    sidebarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            sidebarBtns.forEach(b => b.classList.remove("ativo"));
            panels.forEach(p => p.classList.remove("ativo"));
            btn.classList.add("ativo");
            document.getElementById("panel-" + btn.dataset.panel).classList.add("ativo");
        });
    });

    // ===== CARREGAR DADOS DO USUÁRIO LOGADO =====
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuarioLogado) {
        // Preenche perfil
        document.getElementById("inputLogin").value = usuarioLogado.email || "";
        document.getElementById("inputSenha").value = usuarioLogado.senha || "";
        document.getElementById("textoSobreMim").textContent = usuarioLogado.tipo || "";

        // Preenche dados pessoais
        document.getElementById("dadoNome").textContent = "Nome: " + (usuarioLogado.nome || "N/A");
        document.getElementById("dadoCidade").textContent = "Cidade: " + (usuarioLogado.cidade || "N/A");

        // Carrega pedidos do usuário
        PedidoAPI.buscarPorUsuario(usuarioLogado.id)
            .then(pedidos => {
                const tbody = document.querySelector("#panel-pedidos table tbody");
                tbody.innerHTML = "";

                if (pedidos.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum pedido encontrado.</td></tr>`;
                    return;
                }

                pedidos.forEach(p => {
                    const tr = document.createElement("tr");
                    const data = new Date(p.criadoEm).toLocaleDateString("pt-BR");
                    tr.innerHTML = `
                        <td>${p.produto?.nome ?? "N/A"}</td>
                        <td>${p.quantidade}</td>
                        <td>${data}</td>
                        <td>${p.status}</td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(() => {
                document.querySelector("#panel-pedidos table tbody").innerHTML =
                    `<tr><td colspan="4" style="text-align:center;">Erro ao carregar pedidos.</td></tr>`;
            });

        // Carrega doações do usuário
        DoacaoAPI.buscarPorUsuario(usuarioLogado.id)
            .then(doacoes => {
                const tbody = document.querySelector("#panel-doacoes table tbody");
                tbody.innerHTML = "";

                if (doacoes.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhuma doação encontrada.</td></tr>`;
                    return;
                }

                doacoes.forEach(d => {
                    const tr = document.createElement("tr");
                    const data = new Date(d.data).toLocaleDateString("pt-BR");
                    const totalItens = d.lotes?.reduce((acc, l) => acc + l.quantidade, 0) ?? 0;
                    tr.innerHTML = `
                        <td>${d.lotes?.[0]?.produto?.nome ?? "N/A"}</td>
                        <td>${totalItens}</td>
                        <td>${data}</td>
                        <td>${d.status}</td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(() => {
                document.querySelector("#panel-doacoes table tbody").innerHTML =
                    `<tr><td colspan="4" style="text-align:center;">Erro ao carregar doações.</td></tr>`;
            });

    } else {
        // Usuário não logado
        document.getElementById("textoSobreMim").textContent = "Não logado";
        document.getElementById("textoVinculo").textContent = "Faça login para ver suas informações.";
    }

    // ===== FOTO DE PERFIL =====
    const btnMudarFoto = document.getElementById("btnMudarFoto");
    const inputFoto = document.getElementById("inputFoto");
    const fotoBox = document.getElementById("fotoPerfilBox");

    // Carrega foto salva do localStorage
    const fotoSalva = localStorage.getItem("fotoPerfil");
    if (fotoSalva && fotoBox) {
        fotoBox.innerHTML = "";
        fotoBox.style.background = "none";
        const img = document.createElement("img");
        img.src = fotoSalva;
        img.style.cssText = "width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid var(--cor-primaria);";
        fotoBox.appendChild(img);
    }

    if (btnMudarFoto && inputFoto) {
        btnMudarFoto.addEventListener("click", () => inputFoto.click());

        inputFoto.addEventListener("change", () => {
            const file = inputFoto.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                // Salva no localStorage
                localStorage.setItem("fotoPerfil", e.target.result);

                fotoBox.innerHTML = "";
                fotoBox.style.background = "none";
                const img = document.createElement("img");
                img.src = e.target.result;
                img.style.cssText = "width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid var(--cor-primaria);";
                fotoBox.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    // ===== SALVAR PERFIL — atualiza na API =====
    const btnSalvarPerfil = document.getElementById("btnSalvarPerfil");
    const msgPerfil = document.getElementById("msgPerfil");

    if (btnSalvarPerfil && usuarioLogado) {
        btnSalvarPerfil.addEventListener("click", () => {
            const email = document.getElementById("inputLogin").value;
            const senha = document.getElementById("inputSenha").value;

            if (!email || !senha) {
                msgPerfil.style.color = "red";
                msgPerfil.textContent = "❌ Preencha todos os campos.";
                return;
            }

            const usuarioAtualizado = {
                ...usuarioLogado,
                email: email,
                senha: senha
            };

            msgPerfil.style.color = "gray";
            msgPerfil.textContent = "🔄 Salvando...";

            UsuarioAPI.atualizar(usuarioLogado.id, usuarioAtualizado)
                .then(() => {
                    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
                    msgPerfil.style.color = "green";
                    msgPerfil.textContent = "✅ Perfil atualizado com sucesso!";
                    setTimeout(() => { msgPerfil.textContent = ""; }, 3000);
                })
                .catch(() => {
                    msgPerfil.style.color = "red";
                    msgPerfil.textContent = "❌ Erro ao salvar. Verifique se a API está rodando.";
                });
        });
    }

    // ===== EDITAR DADOS PESSOAIS =====
    const btnsEditar = document.querySelectorAll(".btn-editar-dado");

    btnsEditar.forEach(btn => {
        btn.addEventListener("click", () => {
            const campoId = btn.dataset.campo;
            const label = btn.dataset.label;
            const span = document.getElementById(campoId);
            const valorAtual = span.textContent.split(":").slice(1).join(":").trim();
            const novoValor = prompt("Editar " + label + ":", valorAtual);

            if (novoValor !== null && novoValor.trim() !== "") {
                const prefixo = span.textContent.split(":")[0];
                span.textContent = prefixo + ": " + novoValor.trim();

                const msgDados = document.getElementById("msgDados");
                msgDados.style.color = "green";
                msgDados.textContent = "✅ " + label + " atualizado!";
                setTimeout(() => { msgDados.textContent = ""; }, 3000);
            }
        });
    });

    // ===== SALVAR PREFERÊNCIAS =====
    const btnSalvarOutras = document.getElementById("btnSalvarOutras");
    const msgOutras = document.getElementById("msgOutras");

    if (btnSalvarOutras) {
        btnSalvarOutras.addEventListener("click", () => {
            const idioma = document.getElementById("selectIdioma").value;
            localStorage.setItem("idioma", idioma);

            const temaRadio = document.querySelector("input[name='temaConfig']:checked");
            if (temaRadio) {
                const temaSelecionado = temaRadio.value;
                localStorage.setItem("tema", temaSelecionado);

                if (temaSelecionado === "dark") {
                    document.body.classList.add("dark");
                    document.getElementById("temaBtn").textContent = "☀️";
                } else {
                    document.body.classList.remove("dark");
                    document.getElementById("temaBtn").textContent = "🌙";
                }
            }

            msgOutras.style.color = "green";
            msgOutras.textContent = "✅ Preferências salvas com sucesso!";
            setTimeout(() => { msgOutras.textContent = ""; }, 3000);
        });
    }

    // ===== SINCRONIZAR RADIO DE TEMA =====
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "dark") {
        const radioDark = document.querySelector("input[name='temaConfig'][value='dark']");
        if (radioDark) radioDark.checked = true;
    }

});