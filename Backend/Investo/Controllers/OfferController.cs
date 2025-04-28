using System.Security.Claims;
using Investo.DataAccess.Services.Offers;
using Investo.DataAccess.Services.Project;
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
        private readonly IProjectService _projectService;

        public OfferController(IOfferService offerService, IProjectService projectService)
        {
            _offerService = offerService;
            _projectService = projectService;
        }

        ///<summary>
        /// Create new offer for project , for investors only
        /// </summary>
        [HttpPost("create-offer")]
        public async Task<IActionResult> CreateOffer([FromBody] CreateOrUpdateOfferDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.InvestmentType == "Equity" && !dto.EquityPercentage.HasValue)
                return BadRequest("Equity percentage is required for equity investments.");

            if (dto.InvestmentType == "ProfitShare" && !dto.ProfitShare.HasValue)
                return BadRequest("Profit share is required for profit share investments.");

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

        ///<summary>
        /// Get offer details with investor who made it , for businessOwner,Investor
        /// </summary>

        [HttpGet("get-offer-by-id/{offerId}")]
        public async Task<IActionResult> GetOfferById(int offerId)
        {
            var offer = await _offerService.GetOfferById(offerId);

            if (offer == null)
                return NotFound($"Offer with Id : {offerId} is not found");

            return Ok(offer);
        }

        ///<summary>
        /// Get All offers which offerd to specific project with all status,for businessOwner,Admin
        /// </summary>
        [HttpGet("get-offers-byId/{projectId}")]
        public async Task<IActionResult> GetOffersByProjectId(int projectId)
        {
            if (projectId <= 0)
                return BadRequest("Invalid Project ID.");

            var project = await _projectService.GetProjectById(projectId);
            if (project == null)
                return NotFound($"Project with ID {projectId} does not exist.");

            var offersResult = await _offerService.GetOffersByProjectId(projectId);

            if (!offersResult.IsValid || offersResult.Data == null || !offersResult.Data.Any())
                return Ok(new List<ReadOfferDto>());

            return Ok(offersResult.Data);
        }

        ///<summary>
        /// For respond or take an action with offerd offer that accept the offer or reject it , for businessOwner
        /// </summary>
        [HttpPost("{offerId}/respond")]
        public async Task<IActionResult> RespondToOffer(int offerId, [FromQuery] string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                return BadRequest("Status is required. Allowed values are 'Accepted' or 'Rejected'.");


            var response = await _offerService.RespondToOfferAsync(offerId, status);

            if (!response.IsValid)
                return BadRequest(response.ErrorMessage);

            return Ok(response.Data);
        }

        ///<summary>
        /// Get all offers for current user , when user click on Offers section we call it
        /// </summary>

        [HttpGet("offers/current-user")]
        public async Task<IActionResult> GetOffersForCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userRole))
                return Unauthorized();

            try
            {
                var offers = await _offerService.GetOffersForCurrentUser(userId, userRole);

                return Ok(offers);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}
