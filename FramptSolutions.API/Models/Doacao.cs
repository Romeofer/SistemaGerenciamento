using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FramptSolutions.API.Models
{
    public class Doacao
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        public DateTime Data { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "Pendente"; // "Pendente", "Recebida", "Cancelada"

        [MaxLength(255)]
        public string? Observacao { get; set; }

        // Navegação
        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }

        public ICollection<Lote> Lotes { get; set; } = new List<Lote>();

        // Método encapsulado — verifica se a doação pode ser cancelada
        public bool PodeCancelar()
        {
            return Status == "Pendente";
        }

        // Método encapsulado — retorna total de itens doados
        public int TotalItens()
        {
            return Lotes.Sum(l => l.Quantidade);
        }

        // Polimorfismo — override de ToString()
        public override string ToString()
        {
            return $"Doação #{Id} — Status: {Status} — Data: {Data:dd/MM/yyyy}";
        }
    }
}
