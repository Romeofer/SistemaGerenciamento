using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FramptSolutions.API.Data;
using FramptSolutions.API.Models;

namespace FramptSolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/pedido
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetTodos()
        {
            return await _context.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Produto)
                .ToListAsync();
        }

        // GET: api/pedido/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pedido>> GetPorId(int id)
        {
            var pedido = await _context.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Produto)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null) return NotFound();
            return pedido;
        }

        // GET: api/pedido/usuario/5
        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPorUsuario(int usuarioId)
        {
            return await _context.Pedidos
                .Include(p => p.Produto)
                .Where(p => p.UsuarioId == usuarioId)
                .ToListAsync();
        }

        // POST: api/pedido
        [HttpPost]
        public async Task<ActionResult<Pedido>> Criar(Pedido pedido)
        {
            pedido.Status = "Em Analise";
            pedido.CriadoEm = DateTime.Now;

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPorId), new { id = pedido.Id }, pedido);
        }

        // PUT: api/pedido/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> AtualizarStatus(int id, [FromBody] string novoStatus)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null) return NotFound();

            if (!pedido.PodeAlterar())
                return BadRequest("Pedido já foi aprovado ou reprovado e não pode ser alterado.");

            string[] statusValidos = { "Em Analise", "Aprovado", "Reprovado" };
            if (!statusValidos.Contains(novoStatus))
                return BadRequest("Status inválido. Use: Em Analise, Aprovado ou Reprovado.");

            pedido.Status = novoStatus;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/pedido/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null) return NotFound();

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // GET: api/pedido/estatisticas
        [HttpGet("estatisticas")]
        public async Task<ActionResult> GetEstatisticas()
        {
            var dados = await _context.Pedidos
                .Include(p => p.Produto)
                .GroupBy(p => p.Produto.Nome)
                .Select(g => new {
                    produto = g.Key,
                    total = g.Count(),
                    quantidade = g.Sum(p => p.Quantidade)
                })
                .ToListAsync();

            return Ok(dados);
        }

        // GET: api/pedido/movimentos
        [HttpGet("movimentos")]
        public async Task<ActionResult> GetMovimentos()
        {
            var dados = await _context.Pedidos
                .Include(p => p.Produto)
                .Select(p => new {
                    data = p.CriadoEm.ToString("dd/MM/yyyy"),
                    produto = p.Produto.Nome,
                    tipo = p.Status == "Aprovado" ? "Saída" : "Entrada",
                    quantidade = p.Quantidade,
                    responsavel = p.Usuario.Nome
                })
                .ToListAsync();

            return Ok(dados);
        }
    }
}