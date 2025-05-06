
using Investo.DataAccess;
using Investo.DataAccess.ApplicationContext;
using Microsoft.EntityFrameworkCore;
using Investo.DataAccess.Services.Categories;
using Investo.DataAccess.Services.Interfaces;
using Investo.DataAccess.Repository;
using Investo.Entities.IRepository;
using Investo.DataAccess.Services.Project;
using Investo.DataAccess.Services.Image_Loading;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Investo.DataAccess.Services.Token;
using Investo.DataAccess.Services.Offers;
using System.Reflection;
using Investo.DataAccess.Services.OAuth;
using System.Net.Mail;
using System.Net;
using FluentEmail.Core;
using FluentEmail.Smtp;
using Investo.DataAccess.Services.EmailVerification;
using Investo.DataAccess.Services.Investors;
using Investo.DataAccess.Hubs;
using Investo.DataAccess.Services.Notifications;
using Stripe;

namespace Investo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddSignalR();

            // Active Model State
            builder.Services.AddControllers().ConfigureApiBehaviorOptions(
                options => options.SuppressModelStateInvalidFilter = true
            );

            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

            builder.Services.AddScoped<IProjectService, ProjectService>();
            builder.Services.AddScoped<IProjectRepository, ProjectRepository>();

            builder.Services.AddScoped<IOfferService, OfferService>();
            builder.Services.AddScoped<IOfferRepository, OfferRepository>();

            builder.Services.AddScoped<IImageLoadService, CloudinaryImageLoadService>();
            builder.Services.AddScoped<ITokenService, DataAccess.Services.Token.TokenService>();
            builder.Services.AddAutoMapper(typeof (Program));

            builder.Services.AddScoped<IBusinessOwnerRepository, BusinessOwnerRepository>();

            builder.Services.AddScoped<IAuthGoogleService, AuthGoogleService>();

            builder.Services.AddScoped<IEmailVerificationService, EmailVerificationService>();
            builder.Services.AddScoped<IEmailServiceRepository, EmailServiceRepository>();

            builder.Services.AddScoped<IInvestorRepository, InvestorRepository>();
            builder.Services.AddScoped<IInvestorService, InvestorService>();

            builder.Services.AddScoped<INotificationRepository,NotificationRepository>();
            builder.Services.AddScoped<NotificationService>();

            //Stripe configuration
            //Retrieve the Stripe API keys from appsettings.json
            StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];
            builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(opt =>
            {
                opt.Password.RequireLowercase = true;
                opt.Password.RequireUppercase = true;
                opt.Password.RequiredLength = 12;
                opt.Password.RequireDigit = true;
                opt.Password.RequireNonAlphanumeric = true;
            })
            .AddEntityFrameworkStores<CoreEntitiesDbContext>().AddDefaultTokenProviders();

            builder.Services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme =
                opt.DefaultScheme =
                opt.DefaultChallengeScheme =
                opt.DefaultForbidScheme =
                opt.DefaultSignInScheme =
                opt.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;


            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidIssuer = builder.Configuration["JWT:Issuer"],
                    ValidateAudience = false,
                    ValidAudience = builder.Configuration["JWT:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"]))
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationHub"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins", builder => 
                {
                    builder
                        .SetIsOriginAllowed(origin => true) // يخلي أي origin مسموح مؤقتًا
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials(); // مهم لو بتستخدم Google login أو SignalR
                });
            });

            builder.Services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Investo API", Version = "v1" });

                // إضافة ملف الـ XML
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                option.IncludeXmlComments(xmlPath);

                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
            });

            // For CoreEntitiesDbContext
            builder.Services.AddDbContext<CoreEntitiesDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("ProdCS"),
                    x => x.MigrationsHistoryTable("__EFMigrationsHistory", "CoreEntities")));

            // For RealTimeDbContext
            builder.Services.AddDbContext<RealTimeDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("ProdCS"),
                    x => x.MigrationsHistoryTable("__EFMigrationsHistory", "RealTime")));


            var emailSettings = builder.Configuration.GetSection("EmailSettings").Get<Presentation.EmailSettings>();

            builder.Services
                .AddFluentEmail(emailSettings.FromEmail)
                .AddSmtpSender(new SmtpClient(emailSettings.SmtpServer)
                {
                    Port = emailSettings.SmtpPort,
                    Credentials = new NetworkCredential(emailSettings.Username, emailSettings.Password),
                    EnableSsl = emailSettings.EnableSsl
                });


            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment()||app.Environment.IsProduction())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();


            app.UseCors("AllowAllOrigins");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapHub<NotificationHub>("/notificationHub");


            app.MapControllers();

            app.Run();
        }
    }
}
