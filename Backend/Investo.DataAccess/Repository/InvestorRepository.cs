using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google;
using Investo.DataAccess.ApplicationContext;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Investo.DataAccess.Repository
{
    public class InvestorRepository : IInvestorRepository
    {
        private readonly CoreEntitiesDbContext _context;

        public InvestorRepository(CoreEntitiesDbContext context)
        {
            _context = context;
        }

        public async Task<decimal> GetInvestmentMaxAmount(string investorId)
        {
            return await _context.Investors
                .Where(i => i.Id == investorId)
                .Select(i => i.MaxInvestmentAmount)
                .FirstOrDefaultAsync();
        }

    }
}
