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
    internal class ProjectRepository : IProjectRepository
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

        public async Task Delete(int id)
        {
            var Project = await _context.Projects.FindAsync(id);
            if (Project != null)
            {
                _context.Projects.Remove(Project);
                _context.SaveChanges();
            }
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
    }
}
