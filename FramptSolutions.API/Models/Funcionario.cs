using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FramptSolutions.API.Models
{
    // Herança — Funcionario estende (herda) os dados de Usuario
    public class Funcionario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        [MaxLength(100)]
        public string? Cargo { get; set; }

        [MaxLength(150)]
        public string? LocalAtuacao { get; set; }

        public DateTime CriadoEm { get; set; } = DateTime.Now;

        // Navegação — acessa todos os dados do Usuario vinculado
        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }

        // Método encapsulado — retorna apresentação completa do funcionário
        // Demonstra herança: usa dados do Usuario dentro do Funcionario
        public string Apresentar()
        {
            string nome = Usuario?.Nome ?? "N/A";
            string email = Usuario?.Email ?? "N/A";
            return $"{nome} — Cargo: {Cargo ?? "N/A"} — Local: {LocalAtuacao ?? "N/A"} — Email: {email}";
        }

        // Polimorfismo — override de ToString()
        public override string ToString()
        {
            return $"Funcionário #{Id} — {Cargo ?? "Sem cargo"} em {LocalAtuacao ?? "N/A"}";
        }
    }
}