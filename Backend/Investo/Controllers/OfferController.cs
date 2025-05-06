using System;
using System.Security.Claims;
using Investo.DataAccess.Hubs;
using Investo.DataAccess.Services.Notifications;
using Investo.DataAccess.Services.Offers;
using Investo.DataAccess.Services.Project;
using Investo.Entities.DTO.Offer;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Investo.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly IOfferService _offerService;
        private readonly IProjectService _projectService;
        private readonly NotificationService _notifcationService;

        public OfferController(IOfferService offerService, IProjectService projectService, NotificationService notifcationService)
        {
            _offerService = offerService;
            _projectService = projectService;
            _notifcationService = notifcationService;
        }

        ///<summary>
        /// Create new offer for project , for investors only
        /// </summary>
        [HttpPost("create-offer")]
        public async Task<IActionResult> CreateOffer([FromBody] CreateOrUpdateOfferDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = "Model validation failed",
                    Data = null
                });
            }

            if (dto.InvestmentType == "Equity" && !dto.EquityPercentage.HasValue)
            {
                return BadRequest(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = "Equity percentage is required for equity investments.",
                    Data = null
                });
            }

            if (dto.InvestmentType == "ProfitShare" && !dto.ProfitShare.HasValue)
            {
                return BadRequest(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = "Profit share is required for profit share investments.",
                    Data = null
                });
            }

            try
            {
                var offerResult = await _offerService.CreateOfferAsync(dto);
                // After Creation of the offer ,directly send notification to "BusinessOwner assosiated with offerd project"
                // we have to get the businessOwnerId to send notify to it 
                if (offerResult.IsValid)
                {
                    await _notifcationService.SendOfferNotificationAsync(offerResult.Data);
                    return Ok(offerResult);
                  
                }
                else
                {
                    return BadRequest(offerResult);
                   
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = ex.Message,
                    Data = null
                });
            }
        }

        ///<summary>
        /// Get offer details with investor who made it , for businessOwner,Investor
        /// </summary>
        [HttpGet("get-offer-by-id/{offerId}")]
        public async Task<IActionResult> GetOfferById(int offerId)
        {
            var offerResult = await _offerService.GetOfferById(offerId);

            if (!offerResult.IsValid || offerResult.Data == null)
                return NotFound(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = $"Offer with ID: {offerId} is not found",
                    Data = null
                });

            return Ok(offerResult);
        }



        ///<summary>
        /// Get All offers which offerd to specific project with all status,for businessOwner,Admin
        /// </summary>
        [HttpGet("get-offers-byId/{projectId}")]
        public async Task<IActionResult> GetOffersByProjectId(int projectId)
        {
            if (projectId <= 0)
                return BadRequest(new ValidationResult<List<ReadOfferDto>>
                {
                    IsValid = false,
                    ErrorMessage = "Invalid Project Id",
                    Data = null
                });

            var project = await _projectService.GetProjectById(projectId);
            if (project == null)
                return NotFound(new ValidationResult<List<ReadOfferDto>>
                {
                    IsValid = false,
                    ErrorMessage = $"Project With ID {projectId} does not exist",
                    Data = null
                });

            var offersResult = await _offerService.GetOffersByProjectId(projectId);
            return Ok(offersResult);
        }



        ///<summary>
        /// For respond or take an action with offerd offer that accept the offer or reject it , for businessOwner
        /// </summary>
        [HttpPost("{offerId}/respond")]
        public async Task<IActionResult> RespondToOffer(int offerId, [FromQuery] string status)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return BadRequest(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = "Status is required. Allowed values are 'Accepted' or 'Rejected'.",
                    Data = null
                });
            }

            var response = await _offerService.RespondToOfferAsync(offerId, status);
            await _notifcationService.SendOfferResponseNotificationAsync(offerId, status);

            if (!response.IsValid)
            {
                return BadRequest(response);
            }

            return Ok(response);
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
            {
                return Unauthorized(new ValidationResult<IEnumerable<ReadOfferDto>>
                {
                    IsValid = false,
                    ErrorMessage = "Unauthorized. User ID or Role is missing.",
                    Data = null
                });
            }
            try
            {
                var offers = await _offerService.GetOffersForCurrentUser(userId, userRole);
                return Ok(offers);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new ValidationResult<IEnumerable<ReadOfferDto>>
                {
                    IsValid = false,
                    ErrorMessage = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ValidationResult<IEnumerable<ReadOfferDto>>
                {
                    IsValid = false,
                    ErrorMessage = ex.Message,
                    Data = null
                });
            }
        }
        [HttpGet("investor/{investorId}/accepted_Offers")]
        public async Task<IActionResult> GetAcceptedOffersByInvestorId(string investorId)
        {
            var result = await _offerService.GetAcceptedOffersByInvestorId(investorId);

            if (!result.IsValid)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

    }
}
