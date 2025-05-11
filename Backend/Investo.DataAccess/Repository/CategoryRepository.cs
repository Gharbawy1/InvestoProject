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
    public class CategoryRepository : ICategoryRepository
    {
        private readonly CoreEntitiesDbContext _context;

        public CategoryRepository(CoreEntitiesDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAll()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category> GetById(byte id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<Category> GetByNameAsync(string Name)
        {
            return await _context.Categories.SingleOrDefaultAsync(c=>c.Name == Name);
            
        }
        public async Task Add(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(byte id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }

        public Task<bool> IsValidCategory(byte id)
        {
            return _context.Categories.AnyAsync(c => c.Id == id);
        }
    }
}
