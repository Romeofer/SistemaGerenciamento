// ================================================
// api.js — Conexão com a API FramptSolutions
// ================================================

const API_URL = "https://localhost:7189/api";
// ===== PRODUTOS =====
const ProdutoAPI = {
    listar: () =>
        fetch(`${API_URL}/Produto`)
            .then(res => res.json()),

    listarValidos: () =>
        fetch(`${API_URL}/Produto/validos`)
            .then(res => res.json()),

    buscarPorId: (id) =>
        fetch(`${API_URL}/Produto/${id}`)
            .then(res => res.json()),

    criar: (produto) =>
        fetch(`${API_URL}/Produto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        }).then(res => res.json()),

    atualizar: (id, produto) =>
        fetch(`${API_URL}/Produto/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        }),

    deletar: (id) =>
        fetch(`${API_URL}/Produto/${id}`, { method: "DELETE" }),

    estoque: (id) =>
        fetch(`${API_URL}/Produto/${id}/estoque`)
            .then(res => res.json()),
};

// ===== PEDIDOS =====
const PedidoAPI = {
    listar: () =>
        fetch(`${API_URL}/Pedido`)
            .then(res => res.json()),

    buscarPorUsuario: (usuarioId) =>
        fetch(`${API_URL}/Pedido/usuario/${usuarioId}`)
            .then(res => res.json()),

    criar: (pedido) =>
        fetch(`${API_URL}/Pedido`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        }).then(res => res.json()),

    atualizarStatus: (id, status) =>
        fetch(`${API_URL}/Pedido/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(status)
        }),

    deletar: (id) =>
        fetch(`${API_URL}/Pedido/${id}`, { method: "DELETE" }),

    estatisticas: () =>
        fetch(`${API_URL}/Pedido/estatisticas`)
            .then(res => res.json()),

    movimentos: () =>
        fetch(`${API_URL}/Pedido/movimentos`)
            .then(res => res.json()),
};

// ===== DOAÇÕES =====
const DoacaoAPI = {
    listar: () =>
        fetch(`${API_URL}/Doacao`)
            .then(res => res.json()),

    buscarPorUsuario: (usuarioId) =>
        fetch(`${API_URL}/Doacao/usuario/${usuarioId}`)
            .then(res => res.json()),

    criar: (doacao) =>
        fetch(`${API_URL}/Doacao`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(doacao)
        }).then(res => res.json()),

    cancelar: (id) =>
        fetch(`${API_URL}/Doacao/${id}/cancelar`, { method: "PUT" }),

    deletar: (id) =>
        fetch(`${API_URL}/Doacao/${id}`, { method: "DELETE" }),

    relatorio: () =>
        fetch(`${API_URL}/Doacao/relatorio`)
            .then(res => res.json()),
};

// ===== USUÁRIOS =====
const UsuarioAPI = {
    listar: () =>
        fetch(`${API_URL}/Usuario`)
            .then(res => res.json()),

    buscarPorId: (id) =>
        fetch(`${API_URL}/Usuario/${id}`)
            .then(res => res.json()),

    criar: (usuario) =>
        fetch(`${API_URL}/Usuario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        }).then(res => res.json()),

    atualizar: (id, usuario) =>
        fetch(`${API_URL}/Usuario/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        }),

    deletar: (id) =>
        fetch(`${API_URL}/Usuario/${id}`, { method: "DELETE" })
};