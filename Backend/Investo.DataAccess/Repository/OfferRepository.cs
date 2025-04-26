using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.DataAccess.ApplicationContext;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;


namespace Investo.DataAccess.Repository
{
    public class OfferRepository : IOfferRepository
    {
        private readonly CoreEntitiesDbContext _context;
        public OfferRepository(CoreEntitiesDbContext context)
        {
            _context = context;
        }
        public async Task Create(Offer offer)
        {
            await _context.Offers.AddAsync(offer);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Offer offer)
        {
            _context.Offers.Remove(offer);
            _context.SaveChanges();
        }

        public async Task<IEnumerable<Offer>> GetAll() // offers
        {
            return await _context.Offers
                .Include(p => p.Investor)
                .Include(p => p.Project)
                .ToListAsync();
        }

        public async Task<Offer> GetById(int id) // get offer by id
        {
            var offer = await _context.Offers
                .Include(p => p.Investor)
                .Include(p => p.Project)
                .FirstOrDefaultAsync(p=> p.Id == id);
            return offer;
        }

      
        //public async Task Update(Offer offer)
        //{
        //    _context.Offers.Update(offer);
        //    _context.SaveChanges();
        //}
    }
}
