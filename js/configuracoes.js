document.addEventListener("DOMContentLoaded", () => {

    // ===== VERIFICAR LOGIN =====
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        window.location.href = "login.html";
        return;
    }

    // Função que preenche todos os campos da tela com os dados do usuário
    function preencherDadosNaTela(user) {
        document.getElementById("inputLogin").value = user.email || "";
        document.getElementById("inputSenha").value = user.senha || "";
        document.getElementById("textoSobreMim").textContent = user.tipo || "";
        document.getElementById("dadoNome").innerHTML = "Nome: " + (user.nome || "N/A");
        document.getElementById("dadoCidade").innerHTML = "Cidade: " + (user.cidade || "N/A");
        document.getElementById("dadoCEP").innerHTML = "CEP: " + (user.cep || "N/A");
        document.getElementById("dadoLogradouro").innerHTML = "Logradouro: " + (user.logradouro || "N/A");
        document.getElementById("dadoBairro").innerHTML = "Bairro: " + (user.bairro || "N/A");
    }

    // Busca os dados completos do usuário na API
    UsuarioAPI.buscarPorId(usuarioLogado.id)
        .then(usuarioCompleto => {
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioCompleto));
            usuarioLogado = usuarioCompleto;
            preencherDadosNaTela(usuarioCompleto);
        })
        .catch(() => {
            console.warn("Usando dados do localStorage (endereços podem estar incompletos)");
            preencherDadosNaTela(usuarioLogado);
        });


    // ===== CONTROLE DE FONTE =====
    function aplicarFonte() {
        const tamanho = localStorage.getItem("fontSize") || "normal";
        const familia = localStorage.getItem("fontFamily") || "default";

        // Remove classes anteriores
        document.body.classList.remove("font-small", "font-normal", "font-large");
        document.body.classList.add(`font-${tamanho}`);

        // Aplica família
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

    // Carregar preferências salvas ao iniciar
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    const fontFamilySelect = document.getElementById("fontFamilySelect");

    if (fontSizeSelect) {
        const savedSize = localStorage.getItem("fontSize");
        if (savedSize) fontSizeSelect.value = savedSize;
        fontSizeSelect.addEventListener("change", () => {
            localStorage.setItem("fontSize", fontSizeSelect.value);
            aplicarFonte();
        });
    }

    if (fontFamilySelect) {
        const savedFamily = localStorage.getItem("fontFamily");
        if (savedFamily) fontFamilySelect.value = savedFamily;
        fontFamilySelect.addEventListener("change", () => {
            localStorage.setItem("fontFamily", fontFamilySelect.value);
            aplicarFonte();
        });
    }

    aplicarFonte(); // Aplica imediatamente

    // ===== BOTÃO SALVAR DADOS PESSOAIS =====
    const btnSalvarDados = document.getElementById("btnSalvarDados");
    if (btnSalvarDados) {
        btnSalvarDados.addEventListener("click", () => {
            const usuarioAtualizado = {
                ...usuarioLogado,
                nome: document.getElementById("dadoNome").innerText.replace("Nome: ", ""),
                cep: document.getElementById("dadoCEP").innerText.replace("CEP: ", ""),
                cidade: document.getElementById("dadoCidade").innerText.replace("Cidade: ", ""),
                logradouro: document.getElementById("dadoLogradouro").innerText.replace("Logradouro: ", ""),
                bairro: document.getElementById("dadoBairro").innerText.replace("Bairro: ", "")
            };
            UsuarioAPI.atualizar(usuarioLogado.id, usuarioAtualizado)
                .then(() => {
                    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
                    usuarioLogado = usuarioAtualizado;
                    exibirNotificacao("Dados pessoais atualizados!", "sucesso");
                })
                .catch(() => exibirNotificacao("Erro ao salvar dados", "erro"));
        });
    }

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

    // ===== CARREGAR PEDIDOS =====
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

    // ===== CARREGAR DOAÇÕES =====
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

    // ===== FOTO DE PERFIL =====
    const btnMudarFoto = document.getElementById("btnMudarFoto");
    const inputFoto = document.getElementById("inputFoto");
    const fotoBox = document.getElementById("fotoPerfilBox");

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

    // ===== SALVAR PERFIL (login/senha) =====
    const btnSalvarPerfil = document.getElementById("btnSalvarPerfil");
    const msgPerfil = document.getElementById("msgPerfil");

    if (btnSalvarPerfil) {
        btnSalvarPerfil.addEventListener("click", () => {
            const email = document.getElementById("inputLogin").value;
            const senha = document.getElementById("inputSenha").value;
            if (!email || !senha) {
                msgPerfil.style.color = "red";
                msgPerfil.textContent = "❌ Preencha todos os campos.";
                return;
            }
            const usuarioAtualizado = { ...usuarioLogado, email, senha };
            msgPerfil.style.color = "gray";
            msgPerfil.textContent = "🔄 Salvando...";
            UsuarioAPI.atualizar(usuarioLogado.id, usuarioAtualizado)
                .then(() => {
                    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
                    usuarioLogado = usuarioAtualizado;
                    msgPerfil.style.color = "green";
                    msgPerfil.textContent = "✅ Perfil atualizado com sucesso!";
                    setTimeout(() => msgPerfil.textContent = "", 3000);
                })
                .catch(() => {
                    msgPerfil.style.color = "red";
                    msgPerfil.textContent = "❌ Erro ao salvar. Verifique se a API está rodando.";
                });
        });
    }

    // ===== EDITAR DADOS PESSOAIS (inline) =====
    document.querySelectorAll(".btn-editar-dado").forEach(btn => {
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
                setTimeout(() => msgDados.textContent = "", 3000);
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
            setTimeout(() => msgOutras.textContent = "", 3000);
        });
    }

    // ===== SINCRONIZAR RADIO DE TEMA =====
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "dark") {
        const radioDark = document.querySelector("input[name='temaConfig'][value='dark']");
        if (radioDark) radioDark.checked = true;
    }
});