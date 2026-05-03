using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FramptSolutions.API.Data;
using FramptSolutions.API.Models;

namespace FramptSolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoacaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoacaoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/doacao
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doacao>>> GetTodos()
        {
            return await _context.Doacoes
                .Include(d => d.Usuario)
                .Include(d => d.Lotes)
                    .ThenInclude(l => l.Produto)
                .ToListAsync();
        }

        // GET: api/doacao/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doacao>> GetPorId(int id)
        {
            var doacao = await _context.Doacoes
                .Include(d => d.Usuario)
                .Include(d => d.Lotes)
                    .ThenInclude(l => l.Produto)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doacao == null) return NotFound();
            return doacao;
        }

        // GET: api/doacao/usuario/5
        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<Doacao>>> GetPorUsuario(int usuarioId)
        {
            return await _context.Doacoes
                .Include(d => d.Lotes)
                    .ThenInclude(l => l.Produto)
                .Where(d => d.UsuarioId == usuarioId)
                .ToListAsync();
        }

        // POST: api/doacao
        [HttpPost]
        public async Task<ActionResult<Doacao>> Criar(Doacao doacao)
        {
            doacao.Status = "Pendente";
            doacao.Data = DateTime.Now;

            _context.Doacoes.Add(doacao);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPorId), new { id = doacao.Id }, doacao);
        }

        // PUT: api/doacao/5/cancelar
        [HttpPut("{id}/cancelar")]
        public async Task<IActionResult> Cancelar(int id)
        {
            var doacao = await _context.Doacoes
                .Include(d => d.Lotes)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doacao == null) return NotFound();

            if (!doacao.PodeCancelar())
                return BadRequest("Apenas doações com status Pendente podem ser canceladas.");

            doacao.Status = "Cancelada";
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/doacao/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var doacao = await _context.Doacoes.FindAsync(id);
            if (doacao == null) return NotFound();

            _context.Doacoes.Remove(doacao);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/doacao/relatorio
        [HttpGet("relatorio")]
        public async Task<ActionResult> GetRelatorio()
        {
            var dados = await _context.Doacoes
                .Include(d => d.Usuario)
                .Include(d => d.Lotes)
                    .ThenInclude(l => l.Produto)
                .Select(d => new {
                    data = d.Data.ToString("yyyy-MM-dd"),
                    doador = d.Usuario.Nome,
                    produto = d.Lotes.FirstOrDefault().Produto.Nome,
                    quantidade = d.Lotes.Sum(l => l.Quantidade)
                })
                .ToListAsync();

            return Ok(dados);
        }
    }
}