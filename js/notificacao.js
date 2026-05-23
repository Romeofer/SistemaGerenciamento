// js/notificacao.js
function exibirNotificacao(mensagem, tipo = "info") {
    const div = document.createElement("div");
    div.className = `notificacao notificacao-${tipo}`;
    div.textContent = mensagem;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${tipo === "sucesso" ? "#16a34a" : tipo === "erro" ? "#dc2626" : "#2563eb"};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-weight: bold;
        max-width: 300px;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(div);
    setTimeout(() => div.style.opacity = "1", 10);
    setTimeout(() => {
        div.style.opacity = "0";
        setTimeout(() => div.remove(), 300);
    }, 5000);
}

async function verificarMudancasStatus(usuarioId) {
    const salvos = JSON.parse(localStorage.getItem("statusPedidos") || "{}");
    try {
        const pedidosAtuais = await PedidoAPI.buscarPorUsuario(usuarioId);
        const novosMap = {};
        let houveMudanca = false;

        for (const pedido of pedidosAtuais) {
            novosMap[pedido.id] = pedido.status;
            const statusAntigo = salvos[pedido.id];
            if (statusAntigo && statusAntigo !== pedido.status) {
                houveMudanca = true;
                const mensagem = `📦 Pedido #${pedido.id} – ${pedido.produto?.nome || "produto"} agora está **${pedido.status}**`;
                exibirNotificacao(mensagem, pedido.status === "Aprovado" ? "sucesso" : "erro");
            }
        }

        localStorage.setItem("statusPedidos", JSON.stringify(novosMap));
        return houveMudanca;
    } catch (err) {
        console.warn("Erro ao verificar status:", err);
        return false;
    }
}