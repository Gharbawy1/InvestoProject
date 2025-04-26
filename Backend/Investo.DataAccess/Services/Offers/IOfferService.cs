using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Offer;
using Investo.Entities.Models;

namespace Investo.DataAccess.Services.Offers
{
    public interface IOfferService
    {
        Task<ValidationResult<ReadOfferDto>> CreateOfferAsync(CreateOrUpdateOfferDto offer);
        Task<IEnumerable<ReadOfferDto>> GetAllOffers();
        Task<InvestorBasicInfoDto> GetInvestorByOfferId(int OfferId);
        Task<ReadOfferDto> GetOfferById(int OfferId);
        Task<IEnumerable<ReadOfferDto>> GetOffersByProjectId(int projectId);
        Task<ValidationResult<ReadOfferDto>> RespondToOfferAsync(int offerId, string responseStatus);


    }
}
