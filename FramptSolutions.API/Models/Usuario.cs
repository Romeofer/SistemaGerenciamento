using System.ComponentModel.DataAnnotations;

namespace FramptSolutions.API.Models
{
    // Classe base com encapsulamento (propriedades privadas com getters/setters)
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Senha { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Tipo { get; set; } = string.Empty; // "Doador", "Solicitante", "Farmaceutico"

        [MaxLength(20)]
        public string? Telefone { get; set; }

        public int? Idade { get; set; }

        public DateTime CriadoEm { get; set; } = DateTime.Now;

        // Navegação (relacionamentos)
        public ICollection<Doacao> Doacoes { get; set; } = new List<Doacao>();
        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
        public Funcionario? Funcionario { get; set; }

        // Método encapsulado — valida se o tipo é permitido
        public bool TipoValido()
        {
            string[] tiposPermitidos = { "Doador", "Solicitante", "Farmaceutico" };
            return tiposPermitidos.Contains(Tipo);
        }

        // Polimorfismo — override de ToString()
        public override string ToString()
        {
            return $"[{Tipo}] {Nome} — {Email}";
        }
    }
}
