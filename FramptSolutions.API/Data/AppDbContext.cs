using Microsoft.EntityFrameworkCore;
using FramptSolutions.API.Models;

namespace FramptSolutions.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Tabelas do banco
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Doacao> Doacoes { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Funcionario> Funcionarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Forçar nomes das tabelas no singular
            modelBuilder.Entity<Usuario>().ToTable("Usuario");
            modelBuilder.Entity<Produto>().ToTable("Produto");
            modelBuilder.Entity<Doacao>().ToTable("Doacao");
            modelBuilder.Entity<Lote>().ToTable("Lote");
            modelBuilder.Entity<Pedido>().ToTable("Pedido");
            modelBuilder.Entity<Funcionario>().ToTable("Funcionario");

            // Mapeamento de colunas
            modelBuilder.Entity<Produto>()
                .Property(p => p.Estado).HasColumnName("estado");

            modelBuilder.Entity<Usuario>()
                .Property(u => u.Idade).HasColumnName("idade");

            modelBuilder.Entity<Pedido>()
                .Property(p => p.FotoLaudo).HasColumnName("foto_laudo");

            modelBuilder.Entity<Produto>()
                .Property(p => p.CriadoEm).HasColumnName("criado_em");

            modelBuilder.Entity<Usuario>()
                .Property(u => u.CriadoEm).HasColumnName("criado_em");

            modelBuilder.Entity<Lote>()
                .Property(l => l.CriadoEm).HasColumnName("criado_em");
            modelBuilder.Entity<Lote>()
                .Property(l => l.OutrasInfos).HasColumnName("outras_infos");

            modelBuilder.Entity<Pedido>()
                .Property(p => p.CriadoEm).HasColumnName("criado_em");

            modelBuilder.Entity<Funcionario>()
                .Property(f => f.CriadoEm).HasColumnName("criado_em");
            modelBuilder.Entity<Funcionario>()
                .Property(f => f.LocalAtuacao).HasColumnName("local_atuacao");

            // Usuario
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .Property(u => u.Tipo)
                .HasConversion<string>();

            // Doacao → Usuario
            modelBuilder.Entity<Doacao>()
                .HasOne(d => d.Usuario)
                .WithMany(u => u.Doacoes)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // Lote → Produto
            modelBuilder.Entity<Lote>()
                .HasOne(l => l.Produto)
                .WithMany(p => p.Lotes)
                .HasForeignKey(l => l.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Lote → Doacao
            modelBuilder.Entity<Lote>()
                .HasOne(l => l.Doacao)
                .WithMany(d => d.Lotes)
                .HasForeignKey(l => l.DoacaoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Pedido → Usuario
            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Usuario)
                .WithMany(u => u.Pedidos)
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // Pedido → Produto
            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Produto)
                .WithMany(p => p.Pedidos)
                .HasForeignKey(p => p.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Funcionario → Usuario
            modelBuilder.Entity<Funcionario>()
                .HasOne(f => f.Usuario)
                .WithOne(u => u.Funcionario)
                .HasForeignKey<Funcionario>(f => f.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}