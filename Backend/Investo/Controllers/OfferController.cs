using Investo.DataAccess.Services.Offers;
using Investo.Entities.DTO.Offer;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Investo.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly IOfferService _offerService;

        public OfferController(IOfferService offerService)
        {
            _offerService = offerService;
        }

        [HttpPost("create-offer")]
        public async Task<IActionResult> CreateOffer([FromBody] CreateOrUpdateOfferDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // هنا تتحقق من نوع الاستثمار وايه اللي لازم يتبعت
            if (dto.InvestmentType == "Equity" && !dto.EquityPercentage.HasValue)
                return BadRequest("Equity percentage is required for equity investments.");

            if (dto.InvestmentType == "ProfitShare" && !dto.ProfitShare.HasValue)
                return BadRequest("Profit share is required for profit share investments.");

            // تستدعي السيرفيس عشان تسيف الاوفر
            var offer = new ValidationResult<ReadOfferDto>();
            try
            {
                offer = await _offerService.CreateOfferAsync(dto);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(offer);
        }

        [HttpGet("get-offer-by-id/{offerId}")]
        public async Task<IActionResult> GetOfferById(int offerId)
        {
            var offer = await _offerService.GetOfferById(offerId);

            if (offer == null)
                return NotFound($"Offer with Id : {offerId} is not found");

            return Ok(offer);
        }


    }
}
