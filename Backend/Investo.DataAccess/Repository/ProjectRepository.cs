using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.DataAccess.ApplicationContext;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Investo.DataAccess.Repository
{
    public class ProjectRepository : IProjectRepository
    {
        public readonly CoreEntitiesDbContext _context;
        public ProjectRepository(CoreEntitiesDbContext context)
        {
            _context = context;
        }
        public async Task Create(Project project)
        {
            await _context.Projects.AddAsync(project);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Project project)
        {
            _context.Projects.Remove(project);
            _context.SaveChanges();
        }

        public async Task<IEnumerable<Project>> GetAll()
        {
            return await _context.Projects.ToListAsync();
        }

        public async Task<Project> GetById(int id)
        {
            var Project = await _context.Projects.FindAsync(id);
            return Project;
        }

        public async Task Update(Project project)
        {
            _context.Projects.Update(project);
            _context.SaveChanges();
        }
        public async Task<Project> GetByOwnerIdAsync(string ownerId)
        {
            return await _context.Projects
                .Include(p => p.Owner)       // Include Owner if you need BusinessOwner data
                .FirstOrDefaultAsync(p => p.OwnerId == ownerId);
        }
        public async Task<Project> GetByCategoryIdAsync(byte CategoryId)
        {
            return await _context.Projects
                .Include(p => p.Category)    // Include Category if needed
                .FirstOrDefaultAsync(p => p.CategoryId == CategoryId);
        }

    }
}
