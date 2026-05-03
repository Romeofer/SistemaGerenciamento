using System.ComponentModel.DataAnnotations;

namespace FramptSolutions.API.Models
{
    public class Produto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Descricao { get; set; }

        public string? Estado { get; set; } // "Liquido", "Capsula", "Comprimido", etc.

        public DateTime? Validade { get; set; }

        public DateTime CriadoEm { get; set; } = DateTime.Now;

        // Navegação
        public ICollection<Lote> Lotes { get; set; } = new List<Lote>();
        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();

        // Método encapsulado — verifica se o produto está dentro da validade
        public bool EstaValido()
        {
            if (Validade == null) return true;
            return Validade >= DateTime.Today;
        }

        // Polimorfismo — override de ToString()
        public override string ToString()
        {
            return $"{Nome} (Validade: {Validade?.ToString("dd/MM/yyyy") ?? "N/A"})";
        }
    }
}