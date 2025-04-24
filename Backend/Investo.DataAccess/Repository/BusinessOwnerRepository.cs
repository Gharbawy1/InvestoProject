using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.DataAccess.Services;
using Microsoft.EntityFrameworkCore;
using Investo.Entities.IRepository;
using Investo.DataAccess.ApplicationContext;

namespace Investo.DataAccess.Repository
{   
    public class BusinessOwnerRepository : IBusinessOwnerRepository
    {
        private readonly CoreEntitiesDbContext _context;
        public BusinessOwnerRepository(CoreEntitiesDbContext context)
        {
            _context = context;
        }
        public async Task<bool> ExistsAsync(string ownerId)
        {
            return await _context.BusinessOwners.AnyAsync(o => o.Id == ownerId);
        }
    }
}
