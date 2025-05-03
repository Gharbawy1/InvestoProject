using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Offer;
using Investo.Entities.DTO.Project;
using Investo.Entities.Models;

namespace Investo.Entities.IRepository
{
    public interface IOfferRepository
    {
        Task<IEnumerable<Offer>> GetAll();
        Task<Offer> GetById(int id);
        Task Create(Offer offer);
        Task<IEnumerable<Offer>> GetOffersByProjectId(int projectId);
        Task<Offer> UpdateOfferAsync(Offer offer);

        Task<IEnumerable<Offer>> GetOffersForBusinessOwnerAsync(string ownerId);
        Task<IEnumerable<Offer>> GetOffersForInvestorAsync(string investorId);
        Task<IEnumerable<ProjectRaisedFundDto>> GetOffersAmountForProjectAsync();
        Task<bool> HasInvestorMadeOfferForProject(string investorId, int projectId);
        Task<List<ReadOfferDto>> GetAcceptedOffersByInvestorIdAsync(string investorId);

        Task<decimal> GetOfferAmountAsync(int offerId);

    }
}
