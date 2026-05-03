using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FramptSolutions.API.Migrations
{
    /// <inheritdoc />
    public partial class AtualizarCampos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doacoes_Usuarios_UsuarioId",
                table: "Doacoes");

            migrationBuilder.DropForeignKey(
                name: "FK_Funcionarios_Usuarios_UsuarioId",
                table: "Funcionarios");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Doacoes_DoacaoId",
                table: "Lotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Lotes_Produtos_ProdutoId",
                table: "Lotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedidos_Produtos_ProdutoId",
                table: "Pedidos");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedidos_Usuarios_UsuarioId",
                table: "Pedidos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Produtos",
                table: "Produtos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Pedidos",
                table: "Pedidos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Lotes",
                table: "Lotes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Funcionarios",
                table: "Funcionarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Doacoes",
                table: "Doacoes");

            migrationBuilder.DropColumn(
                name: "PesoKg",
                table: "Produtos");

            migrationBuilder.RenameTable(
                name: "Usuarios",
                newName: "Usuario");

            migrationBuilder.RenameTable(
                name: "Produtos",
                newName: "Produto");

            migrationBuilder.RenameTable(
                name: "Pedidos",
                newName: "Pedido");

            migrationBuilder.RenameTable(
                name: "Lotes",
                newName: "Lote");

            migrationBuilder.RenameTable(
                name: "Funcionarios",
                newName: "Funcionario");

            migrationBuilder.RenameTable(
                name: "Doacoes",
                newName: "Doacao");

            migrationBuilder.RenameColumn(
                name: "CriadoEm",
                table: "Usuario",
                newName: "criado_em");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_Email",
                table: "Usuario",
                newName: "IX_Usuario_Email");

            migrationBuilder.RenameColumn(
                name: "CriadoEm",
                table: "Produto",
                newName: "criado_em");

            migrationBuilder.RenameColumn(
                name: "CriadoEm",
                table: "Pedido",
                newName: "criado_em");

            migrationBuilder.RenameIndex(
                name: "IX_Pedidos_UsuarioId",
                table: "Pedido",
                newName: "IX_Pedido_UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_Pedidos_ProdutoId",
                table: "Pedido",
                newName: "IX_Pedido_ProdutoId");

            migrationBuilder.RenameColumn(
                name: "OutrasInfos",
                table: "Lote",
                newName: "outras_infos");

            migrationBuilder.RenameColumn(
                name: "CriadoEm",
                table: "Lote",
                newName: "criado_em");

            migrationBuilder.RenameIndex(
                name: "IX_Lotes_ProdutoId",
                table: "Lote",
                newName: "IX_Lote_ProdutoId");

            migrationBuilder.RenameIndex(
                name: "IX_Lotes_DoacaoId",
                table: "Lote",
                newName: "IX_Lote_DoacaoId");

            migrationBuilder.RenameColumn(
                name: "LocalAtuacao",
                table: "Funcionario",
                newName: "local_atuacao");

            migrationBuilder.RenameColumn(
                name: "CriadoEm",
                table: "Funcionario",
                newName: "criado_em");

            migrationBuilder.RenameIndex(
                name: "IX_Funcionarios_UsuarioId",
                table: "Funcionario",
                newName: "IX_Funcionario_UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_Doacoes_UsuarioId",
                table: "Doacao",
                newName: "IX_Doacao_UsuarioId");

            migrationBuilder.AddColumn<int>(
                name: "idade",
                table: "Usuario",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "estado",
                table: "Produto",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "foto_laudo",
                table: "Pedido",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Usuario",
                table: "Usuario",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Produto",
                table: "Produto",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Pedido",
                table: "Pedido",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Lote",
                table: "Lote",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Funcionario",
                table: "Funcionario",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Doacao",
                table: "Doacao",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Doacao_Usuario_UsuarioId",
                table: "Doacao",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Funcionario_Usuario_UsuarioId",
                table: "Funcionario",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lote_Doacao_DoacaoId",
                table: "Lote",
                column: "DoacaoId",
                principalTable: "Doacao",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lote_Produto_ProdutoId",
                table: "Lote",
                column: "ProdutoId",
                principalTable: "Produto",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_Produto_ProdutoId",
                table: "Pedido",
                column: "ProdutoId",
                principalTable: "Produto",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_Usuario_UsuarioId",
                table: "Pedido",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doacao_Usuario_UsuarioId",
                table: "Doacao");

            migrationBuilder.DropForeignKey(
                name: "FK_Funcionario_Usuario_UsuarioId",
                table: "Funcionario");

            migrationBuilder.DropForeignKey(
                name: "FK_Lote_Doacao_DoacaoId",
                table: "Lote");

            migrationBuilder.DropForeignKey(
                name: "FK_Lote_Produto_ProdutoId",
                table: "Lote");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_Produto_ProdutoId",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_Usuario_UsuarioId",
                table: "Pedido");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Usuario",
                table: "Usuario");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Produto",
                table: "Produto");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Pedido",
                table: "Pedido");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Lote",
                table: "Lote");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Funcionario",
                table: "Funcionario");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Doacao",
                table: "Doacao");

            migrationBuilder.DropColumn(
                name: "idade",
                table: "Usuario");

            migrationBuilder.DropColumn(
                name: "estado",
                table: "Produto");

            migrationBuilder.DropColumn(
                name: "foto_laudo",
                table: "Pedido");

            migrationBuilder.RenameTable(
                name: "Usuario",
                newName: "Usuarios");

            migrationBuilder.RenameTable(
                name: "Produto",
                newName: "Produtos");

            migrationBuilder.RenameTable(
                name: "Pedido",
                newName: "Pedidos");

            migrationBuilder.RenameTable(
                name: "Lote",
                newName: "Lotes");

            migrationBuilder.RenameTable(
                name: "Funcionario",
                newName: "Funcionarios");

            migrationBuilder.RenameTable(
                name: "Doacao",
                newName: "Doacoes");

            migrationBuilder.RenameColumn(
                name: "criado_em",
                table: "Usuarios",
                newName: "CriadoEm");

            migrationBuilder.RenameIndex(
                name: "IX_Usuario_Email",
                table: "Usuarios",
                newName: "IX_Usuarios_Email");

            migrationBuilder.RenameColumn(
                name: "criado_em",
                table: "Produtos",
                newName: "CriadoEm");

            migrationBuilder.RenameColumn(
                name: "criado_em",
                table: "Pedidos",
                newName: "CriadoEm");

            migrationBuilder.RenameIndex(
                name: "IX_Pedido_UsuarioId",
                table: "Pedidos",
                newName: "IX_Pedidos_UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_Pedido_ProdutoId",
                table: "Pedidos",
                newName: "IX_Pedidos_ProdutoId");

            migrationBuilder.RenameColumn(
                name: "outras_infos",
                table: "Lotes",
                newName: "OutrasInfos");

            migrationBuilder.RenameColumn(
                name: "criado_em",
                table: "Lotes",
                newName: "CriadoEm");

            migrationBuilder.RenameIndex(
                name: "IX_Lote_ProdutoId",
                table: "Lotes",
                newName: "IX_Lotes_ProdutoId");

            migrationBuilder.RenameIndex(
                name: "IX_Lote_DoacaoId",
                table: "Lotes",
                newName: "IX_Lotes_DoacaoId");

            migrationBuilder.RenameColumn(
                name: "local_atuacao",
                table: "Funcionarios",
                newName: "LocalAtuacao");

            migrationBuilder.RenameColumn(
                name: "criado_em",
                table: "Funcionarios",
                newName: "CriadoEm");

            migrationBuilder.RenameIndex(
                name: "IX_Funcionario_UsuarioId",
                table: "Funcionarios",
                newName: "IX_Funcionarios_UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_Doacao_UsuarioId",
                table: "Doacoes",
                newName: "IX_Doacoes_UsuarioId");

            migrationBuilder.AddColumn<decimal>(
                name: "PesoKg",
                table: "Produtos",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Produtos",
                table: "Produtos",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Pedidos",
                table: "Pedidos",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Lotes",
                table: "Lotes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Funcionarios",
                table: "Funcionarios",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Doacoes",
                table: "Doacoes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Doacoes_Usuarios_UsuarioId",
                table: "Doacoes",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Funcionarios_Usuarios_UsuarioId",
                table: "Funcionarios",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Doacoes_DoacaoId",
                table: "Lotes",
                column: "DoacaoId",
                principalTable: "Doacoes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lotes_Produtos_ProdutoId",
                table: "Lotes",
                column: "ProdutoId",
                principalTable: "Produtos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_Produtos_ProdutoId",
                table: "Pedidos",
                column: "ProdutoId",
                principalTable: "Produtos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_Usuarios_UsuarioId",
                table: "Pedidos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
