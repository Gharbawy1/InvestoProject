using Investo.Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.DataAccess.ApplicationContext
{
    // TODO : Make a migratoin for this context
    public class RealTimeDbContext:DbContext
    {
        public RealTimeDbContext(DbContextOptions<RealTimeDbContext> options)
             : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("RealTime");
            base.OnModelCreating(modelBuilder);
        }


        //public DbSet<OpenChatRequest> OpenChatRequests { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        //public DbSet<Message> Messages { get; set; }
        //public DbSet<Attachment> Attachments { get; set; }
    }
}
