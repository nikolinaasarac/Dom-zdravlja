using System.Text;
using API.Data;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using AutoMapper;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<DomZdravljaContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// 🔹 Dodaj CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins("https://localhost:3000") // frontend origin
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // za cookie-based refresh token
    });
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// 🔹 JWT autentikacija
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["AppSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["AppSettings:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!)),
            ValidateIssuerSigningKey = true
        };
    });

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDoktorService, DoktorService>();
builder.Services.AddScoped<IPacijentService, PacijentService>();
builder.Services.AddScoped<IPregledService, PregledService>();
builder.Services.AddScoped<IUputnicaService, UputnicaService>();
builder.Services.AddScoped<IVakcinacijaService, VakcinacijaService>();
builder.Services.AddScoped<ITehnicarService, TehnicarService>();
builder.Services.AddScoped<IZdravstvenoStanjeService, ZdravstvenoStanjeService>();
builder.Services.AddScoped<IKrvnaGrupaService, KrvnaGrupaService>();


var app = builder.Build();
QuestPDF.Settings.License = LicenseType.Community;

// 🔹 Middleware redoslijed je važan
app.UseCors("ReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseStaticFiles(); // ovo omogućava pristup svim fajlovima u wwwroot


DbInitializer.InitDb(app);

app.Run();
