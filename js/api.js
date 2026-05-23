const API_URL = "https://localhost:7189/api";

function getToken() {
    return localStorage.getItem("token") || "";
}

function authHeaders() {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

// Tratamento de respostas e redirecionamento em caso de 401
async function handleResponse(res) {
    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
        throw new Error("Sessão expirada. Faça login novamente.");
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// ===== PRODUTOS =====
const ProdutoAPI = {
    listar: () => fetch(`${API_URL}/Produto`, { headers: authHeaders() }).then(handleResponse),
    listarValidos: () =>
        fetch(`${API_URL}/Produto/validos`, { headers: authHeaders() })
            .then(res => {
                if (res.status === 401) throw new Error("Não autorizado");
                return res.json();
            }),
    buscarPorId: (id) => fetch(`${API_URL}/Produto/${id}`, { headers: authHeaders() }).then(handleResponse),
    criar: (produto) => fetch(`${API_URL}/Produto`, { method: "POST", headers: authHeaders(), body: JSON.stringify(produto) }).then(handleResponse),
    atualizar: (id, produto) => fetch(`${API_URL}/Produto/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(produto) }),
    deletar: (id) => fetch(`${API_URL}/Produto/${id}`, { method: "DELETE", headers: authHeaders() }),
    estoque: (id) => fetch(`${API_URL}/Produto/${id}/estoque`, { headers: authHeaders() }).then(handleResponse),
};

// ===== PEDIDOS =====
const PedidoAPI = {
    listar: () => fetch(`${API_URL}/Pedido`, { headers: authHeaders() }).then(handleResponse),
    buscarPorUsuario: (usuarioId) => fetch(`${API_URL}/Pedido/usuario/${usuarioId}`, { headers: authHeaders() }).then(handleResponse),
    criar: (pedido) => fetch(`${API_URL}/Pedido`, { method: "POST", headers: authHeaders(), body: JSON.stringify(pedido) }).then(handleResponse),
    atualizarStatus: (id, status) => fetch(`${API_URL}/Pedido/${id}/status`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(status) }),
    deletar: (id) => fetch(`${API_URL}/Pedido/${id}`, { method: "DELETE", headers: authHeaders() }),
    estatisticas: () => fetch(`${API_URL}/Pedido/estatisticas`, { headers: authHeaders() }).then(handleResponse),
    movimentos: () => fetch(`${API_URL}/Pedido/movimentos`, { headers: authHeaders() }).then(handleResponse),
    movimentosCorrigido: () => fetch(`${API_URL}/Pedido/movimentos-corrigido`, { headers: authHeaders() }).then(handleResponse),
};

// ===== DOAÇÕES =====
const DoacaoAPI = {
    listar: () => fetch(`${API_URL}/Doacao`, { headers: authHeaders() }).then(handleResponse),
    buscarPorUsuario: (usuarioId) => fetch(`${API_URL}/Doacao/usuario/${usuarioId}`, { headers: authHeaders() }).then(handleResponse),
    criar: (doacao) => fetch(`${API_URL}/Doacao`, { method: "POST", headers: authHeaders(), body: JSON.stringify(doacao) }).then(handleResponse),
    cancelar: (id) => fetch(`${API_URL}/Doacao/${id}/cancelar`, { method: "PUT", headers: authHeaders() }),
    deletar: (id) => fetch(`${API_URL}/Doacao/${id}`, { method: "DELETE", headers: authHeaders() }),
    relatorio: () => fetch(`${API_URL}/Doacao/relatorio`, { headers: authHeaders() }).then(handleResponse),
    receber: (id) => fetch(`${API_URL}/Doacao/${id}/receber`, { method: "PUT", headers: authHeaders() }),
};

// ===== USUÁRIOS =====
const UsuarioAPI = {
    listar: () => fetch(`${API_URL}/Usuario`, { headers: authHeaders() }).then(handleResponse),
    buscarPorId: (id) => fetch(`${API_URL}/Usuario/${id}`, { headers: authHeaders() }).then(handleResponse),
    criar: (usuario) => fetch(`${API_URL}/Usuario`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(usuario) }).then(handleResponse),
    atualizar: (id, usuario) => fetch(`${API_URL}/Usuario/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(usuario) }),
    deletar: (id) => fetch(`${API_URL}/Usuario/${id}`, { method: "DELETE", headers: authHeaders() }),
};