using Investo.Entities.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.DataAccess.ApplicationContext
{
    public class CoreEntitiesDbContext:IdentityDbContext<ApplicationUser>
    {
        // TODO : Make a migration for this Context 
        public CoreEntitiesDbContext(DbContextOptions<CoreEntitiesDbContext> options)
             : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("CoreEntities");
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Investor>().OwnsOne(i => i.PersonInfo);
            modelBuilder.Entity<BusinessOwner>().OwnsOne(b => b.PersonInfo);

            // TPT Mapping for inherited types
            modelBuilder.Entity<Investor>().ToTable("Investors");
            modelBuilder.Entity<BusinessOwner>().ToTable("BusinessOwners");
        }
        // Main Entities
        public DbSet<Project> Projects { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Category> Categories { get; set; }

        // User Types
        public DbSet<Investor> Investors { get; set; }
        public DbSet<BusinessOwner> BusinessOwners { get; set; }

    }
}
