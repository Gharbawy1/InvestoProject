using System;
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
            {
                return Ok(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = "Model validation failed",
                    Data = null
                });
            }

            if (dto.InvestmentType == "Equity" && !dto.EquityPercentage.HasValue)
            {
                return Ok(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = "Equity percentage is required for equity investments.",
                    Data = null
                });
            }

            if (dto.InvestmentType == "ProfitShare" && !dto.ProfitShare.HasValue)
            {
                return Ok(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = "Profit share is required for profit share investments.",
                    Data = null
                });
            }

            try
            {
                var offerResult = await _offerService.CreateOfferAsync(dto);

                if (!offerResult.IsValid)
                {
                    return Ok(new ValidationResult<ReadOfferDto>
                    {
                        IsValid = false,
                        ErrorMessage = offerResult.ErrorMessage,
                        Data = null
                    });
                }

                return Ok(new ValidationResult<ReadOfferDto>
                {
                    IsValid = true,
                    Data = offerResult.Data,
                    ErrorMessage = null
                });
            }
            catch (Exception ex)
            {
                return Ok(new ValidationResult<ReadOfferDto>
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
                return Ok(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = $"Offer with ID: {offerId} is not found",
                    Data = null
                });

            return Ok(new ValidationResult<ReadOfferDto>
            {
                IsValid = true,
                ErrorMessage = null,
                Data = offerResult.Data
            });
        }



        ///<summary>
        /// Get All offers which offerd to specific project with all status,for businessOwner,Admin
        /// </summary>
        [HttpGet("get-offers-byId/{projectId}")]
        public async Task<IActionResult> GetOffersByProjectId(int projectId)
        {
            if (projectId <= 0)
                return Ok(new ValidationResult<List<ReadOfferDto>>
                {
                    IsValid = false,
                    ErrorMessage = "Invalid Project Id",
                    Data = null
                });

            var project = await _projectService.GetProjectById(projectId);
            if (project == null)
                return Ok(new ValidationResult<List<ReadOfferDto>>
                {
                    IsValid = false,
                    ErrorMessage = $"Project With ID {projectId} does not exist",
                    Data = null
                });

            var offersResult = await _offerService.GetOffersByProjectId(projectId);

            return Ok(new ValidationResult<List<ReadOfferDto>>
            {
                IsValid = offersResult.IsValid,
                ErrorMessage = offersResult.ErrorMessage,
                Data = offersResult.Data
            });
        }


        ///<summary>
        /// For respond or take an action with offerd offer that accept the offer or reject it , for businessOwner
        /// </summary>
        [HttpPost("{offerId}/respond")]
        public async Task<IActionResult> RespondToOffer(int offerId, [FromQuery] string status)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return Ok(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = "Status is required. Allowed values are 'Accepted' or 'Rejected'.",
                    Data = null
                });
            }

            var response = await _offerService.RespondToOfferAsync(offerId, status);

            if (!response.IsValid)
            {
                return Ok(new ValidationResult<ReadOfferDto>
                {
                    IsValid = false,
                    ErrorMessage = response.ErrorMessage,
                    Data = null
                });
            }

            return Ok(new ValidationResult<ReadOfferDto>
            {
                IsValid = true,
                ErrorMessage = null,
                Data = response.Data
            });
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

                return Ok(new ValidationResult<IEnumerable<ReadOfferDto>>
                {
                    Data = offers.Data,
                    IsValid = true,
                    ErrorMessage = null
                });
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
                return Ok(new ValidationResult<List<ReadOfferDto>>
                {
                    IsValid = false,
                    ErrorMessage = result.ErrorMessage,
                    Data = null
                });
            }

            return Ok(new ValidationResult<List<ReadOfferDto>>
            {
                Data = result.Data,
                IsValid = true,
                ErrorMessage = null
            });
        }




    }
}
