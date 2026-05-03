using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FramptSolutions.API.Models
{
    public class Pedido
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        [Required]
        public int ProdutoId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantidade deve ser maior que zero")]
        public int Quantidade { get; set; }

        [MaxLength(255)]
        public string? Descricao { get; set; }

        public string? FotoLaudo { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Em Analise"; // "Em Analise", "Aprovado", "Reprovado"

        public DateTime CriadoEm { get; set; } = DateTime.Now;

        // Navegação
        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }

        [ForeignKey("ProdutoId")]
        public Produto? Produto { get; set; }

        // Método encapsulado — verifica se o pedido ainda pode ser alterado
        public bool PodeAlterar()
        {
            return Status == "Em Analise";
        }

        // Método encapsulado — verifica se foi aprovado
        public bool FoiAprovado()
        {
            return Status == "Aprovado";
        }

        // Polimorfismo — override de ToString()
        public override string ToString()
        {
            return $"Pedido #{Id} — Produto: {Produto?.Nome ?? "N/A"} — Qtd: {Quantidade} — Status: {Status}";
        }
    }
}
