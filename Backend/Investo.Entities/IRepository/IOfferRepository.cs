using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.Entities.IRepository
{
    public interface IOfferRepository
    {
        Task<IEnumerable<Offer>> GetAll();
        Task<Offer> GetById(int id);
        Task Create(Offer offer);
        Task<bool> IsThereAnyOffersForInvestor(string InvestorId);
       
    }
}
