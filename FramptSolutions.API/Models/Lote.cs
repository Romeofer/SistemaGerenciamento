using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FramptSolutions.API.Models
{
    public class Lote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProdutoId { get; set; }

        [Required]
        public int DoacaoId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantidade deve ser maior que zero")]
        public int Quantidade { get; set; }

        [MaxLength(150)]
        public string? Origem { get; set; }

        [MaxLength(255)]
        public string? OutrasInfos { get; set; }

        public DateTime CriadoEm { get; set; } = DateTime.Now;

        // Navegação
        [ForeignKey("ProdutoId")]
        public Produto? Produto { get; set; }

        [ForeignKey("DoacaoId")]
        public Doacao? Doacao { get; set; }

        // Método encapsulado — verifica se o lote ainda tem estoque
        public bool TemEstoque()
        {
            return Quantidade > 0;
        }

        // Polimorfismo — override de ToString()
        public override string ToString()
        {
            return $"Lote #{Id} — Produto: {Produto?.Nome ?? "N/A"} — Qtd: {Quantidade} — Origem: {Origem ?? "N/A"}";
        }
    }
}