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
            return await _context.Projects
                .Include(p => p.Owner)
                .Include(p => p.Category)
                .ToListAsync();
        }

        public async Task<Project> GetById(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Owner)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            return project;
        }


        public async Task Update(Project project)
        {
            _context.Projects.Update(project);
            _context.SaveChanges();
        }
        public async Task<Project> GetByOwnerIdAsync(string ownerId)
        {
            return await _context.Projects
                .Include(p=>p.Category)
                .Include(p => p.Owner)       // Include Owner if you need BusinessOwner data
                .FirstOrDefaultAsync(p => p.OwnerId == ownerId);
        }
        public async Task<List<Project>> GetProjectsByCategory(byte CategoryId)
        {
            return await _context.Projects
                .Include (p => p.Category)
                .Include(p=>p.Owner)
                .Where(p => p.CategoryId == CategoryId).ToListAsync();
        }

        public async Task<IEnumerable<Project>> GetProjectRequestsByStatusAsync(ProjectStatus status)
        {
            return await _context.Projects
                .Where(p => p.Status == status)
                .Include(p => p.Owner)
                .ThenInclude(owner => owner.PersonInfo)
                .Include(p => p.Category)
                .ToListAsync();
        }

        public async Task<bool> HasProjectForOwner(string ownerId)
        {
            return await _context.Projects.AnyAsync(p => p.OwnerId == ownerId);
        }
        public async Task<int> GetInvestorsCountByProjectIdAsync(int projectId)
        {
            return await _context.Offers
                .Where(o => o.ProjectId == projectId && o.InvestorId != null && o.Status == OfferStatus.Accepted)
                .Select(o => o.InvestorId)
                .CountAsync();
        }

        
    }
}
