using Microsoft.EntityFrameworkCore;
using FramptSolutions.API.Data;

var builder = WebApplication.CreateBuilder(args);

// ===== BANCO DE DADOS =====
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===== CORS (permite o front-end HTML chamar a API) =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontEnd", policy =>
    {
        policy.WithOrigins(
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "null"
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// ===== CONTROLLERS =====
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ===== SWAGGER (interface para testar a API) =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("PermitirFrontEnd");
app.UseAuthorization();
app.MapControllers();

app.Run();