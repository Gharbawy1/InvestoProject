
using Investo.DataAccess;
using Investo.DataAccess.ApplicationContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
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
using Investo.Entities.Models.Config;
using Investo.Presentation.Extensions;
using Investo.Presentation;

namespace Investo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            // Active Model State
            builder.Services.AddControllers().ConfigureApiBehaviorOptions(
                options => options.SuppressModelStateInvalidFilter = true
            );

            builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JWT"));
            builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
            builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
            builder.Services.Configure<GoogleAuthSettings>(builder.Configuration.GetSection("Authorization:Google"));
            builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

            builder.Services.AddApplicationServices();
            builder.Services.AddDatabase(builder.Configuration);
            builder.Services.AddAuthenticationAndAuthorization(builder.Configuration);
            builder.Services.AddEmailServices(builder.Configuration);
            builder.Services.AddStripe(builder.Configuration);


            builder.Services.AddDataProtection()
                .PersistKeysToDbContext<CoreEntitiesDbContext>() // <-- هنا السحر
                .SetApplicationName("Investo");

            
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

            builder.Services.AddSwagger();

            builder.Services.AddEndpointsApiExplorer();

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
