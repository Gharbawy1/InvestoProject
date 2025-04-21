
using Investo.DataAccess;
using Investo.DataAccess.ApplicationContext;
using Microsoft.EntityFrameworkCore;
using Investo.DataAccess.Services.Categories;
using Investo.DataAccess.Services.Interfaces;
using Investo.DataAccess.Repository;
using Investo.Entities.IRepository;
using Investo.DataAccess.Services.Project;
using Investo.DataAccess.Services.Image_Loading;

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

            // Active Model State
            builder.Services.AddControllers().ConfigureApiBehaviorOptions(
                options => options.SuppressModelStateInvalidFilter = true
            );

            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

            builder.Services.AddScoped<IProjectService, ProjectService>();
            builder.Services.AddScoped<IProjectRepository, ProjectRepository>();

            builder.Services.AddScoped<IImageLoadService, CloudinaryImageLoadService>();


            // For CoreEntitiesDbContext
            builder.Services.AddDbContext<CoreEntitiesDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DevCS"),
                    x => x.MigrationsHistoryTable("__EFMigrationsHistory", "CoreEntities")));

            // For RealTimeDbContext
            builder.Services.AddDbContext<RealTimeDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DevCS"),
                    x => x.MigrationsHistoryTable("__EFMigrationsHistory", "RealTime")));


            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();


            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
