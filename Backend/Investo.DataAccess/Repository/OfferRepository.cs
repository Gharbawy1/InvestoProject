using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.DataAccess.ApplicationContext;
using Investo.Entities.DTO.Project;
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

        public async Task<bool> HasInvestorMadeOfferForProject(string investorId, int projectId)
        {
            return await _context.Offers.AnyAsync(o => o.InvestorId == investorId && o.ProjectId == projectId);
        }
        public async Task<IEnumerable<Offer>> GetOffersByProjectId(int projectId)
        {
            return await _context.Offers
                .Include(o=>o.Investor)
                .Include(o=>o.Project)
                .Where(o => o.ProjectId == projectId)
                .ToListAsync();
        }

        public async Task<Offer> UpdateOfferAsync(Offer offer)
        {
            var existingOffer = await _context.Offers.FindAsync(offer.Id);
            if (existingOffer == null)
            {
                return null; 
            }

            _context.Entry(existingOffer).CurrentValues.SetValues(offer);
            await _context.SaveChangesAsync();

            return existingOffer;
        }



        public async Task<IEnumerable<Offer>> GetOffersForBusinessOwnerAsync(string ownerId)
        {
            return await _context.Offers
                .Where(o => o.Project.OwnerId == ownerId)
                .Include(o => o.Investor)
                .Include(o=>o.Project)
                .ToListAsync();
        }

        public async Task<IEnumerable<Offer>> GetOffersForInvestorAsync(string investorId)
        {
            return await _context.Offers
                .Where(o => o.InvestorId == investorId)
                .Include(o => o.Investor)
                .Include(o => o.Project)
                .ToListAsync();

        public async Task<IEnumerable<ProjectRaisedFundDto>> GetOffersAmountForProjectAsync()
        {
            return await _context.Offers
        .Where(o => o.Status == OfferStatus.Accepted)
        .GroupBy(o => o.ProjectId)
        .Select(g => new ProjectRaisedFundDto
        {
            ProjectId = g.Key,
            RaisedFund = g.Sum(o => o.OfferAmount)
        })
        .ToListAsync();

        }
    }


}
