using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FramptSolutions.API.Data;
using FramptSolutions.API.Models;

namespace FramptSolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/produto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetTodos()
        {
            return await _context.Produtos.ToListAsync();
        }

        // GET: api/produto/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetPorId(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return NotFound();
            return produto;
        }

        // GET: api/produto/validos
        [HttpGet("validos")]
        public async Task<ActionResult<IEnumerable<Produto>>> GetValidos()
        {
            return await _context.Produtos
                .Where(p => p.Validade == null || p.Validade >= DateTime.Today)
                .ToListAsync();
        }

        // POST: api/produto
        [HttpPost]
        public async Task<ActionResult<Produto>> Criar(Produto produto)
        {
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPorId), new { id = produto.Id }, produto);
        }

        // PUT: api/produto/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, Produto produto)
        {
            if (id != produto.Id) return BadRequest();

            _context.Entry(produto).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/produto/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return NotFound();

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/produto/5/estoque
        [HttpGet("{id}/estoque")]
        public async Task<ActionResult<int>> GetEstoque(int id)
        {
            var estoque = await _context.Lotes
                .Where(l => l.ProdutoId == id)
                .SumAsync(l => l.Quantidade);

            return Ok(estoque);
        }
    }
}