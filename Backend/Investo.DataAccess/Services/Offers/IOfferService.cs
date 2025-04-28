using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Offer;
using Investo.Entities.DTO.Project;
using Investo.Entities.Models;

namespace Investo.DataAccess.Services.Offers
{
    public interface IOfferService
    {
        Task<ValidationResult<ReadOfferDto>> CreateOfferAsync(CreateOrUpdateOfferDto offer);
        Task<IEnumerable<ReadOfferDto>> GetAllOffers();
        Task<ValidationResult<InvestorBasicInfoDto>> GetInvestorByOfferId(int OfferId);
        Task<ValidationResult<ReadOfferDto>> GetOfferById(int OfferId);
        Task<ValidationResult<List<ReadOfferDto>>> GetOffersByProjectId(int projectId);
        Task<ValidationResult<ReadOfferDto>> RespondToOfferAsync(int offerId, string responseStatus);
        Task<ValidationResult<IEnumerable<ReadOfferDto>>> GetOffersForCurrentUser(string userId, string userRole);
        Task<IEnumerable<ProjectRaisedFundDto>> GetProjectsRaisedFundsAsync();
    }

}
