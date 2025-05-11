using Investo.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Stripe;
using Investo.DataAccess.Services.Project;
using Investo.Entities.DTO.Stripe;
using Investo.Entities.IRepository;

namespace Investo.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StripeController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IProjectService _projectService;
        private readonly IOfferRepository _offerRepository;
        private readonly IConfiguration _configuration;
        public StripeController(UserManager<ApplicationUser> userManager, IProjectService projectService, IOfferRepository offerRepository, IConfiguration configuration)
        {
            _userManager = userManager;
            _projectService = projectService;
            _offerRepository = offerRepository;
            _configuration = configuration;
        }

        [HttpPost("create-checkout-session")]
        [Authorize(Roles = "Investor")]
        public async Task<ActionResult<ValidationResult<string>>> CreateCheckoutSession([FromBody] CheckoutRequestDto request)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(new ValidationResult<string>
                    {
                        IsValid = false,
                        ErrorMessage = "اليوزر مش موجود"
                    });
                }

                var project = await _projectService.GetProjectById(request.ProjectId);
                if (project == null)
                {
                    return BadRequest(new ValidationResult<string>
                    {
                        IsValid = false,
                        ErrorMessage = "المشروع مش موجود"
                    });
                }
                var offerAmount = await _offerRepository.GetOfferAmountAsync(request.OfferId);
                    
                // Configure Checkout Session
                var options = new SessionCreateOptions
                {
                    PaymentMethodTypes = new List<string> { "card" },
                    LineItems = new List<SessionLineItemOptions>
                    {
                        new SessionLineItemOptions
                        {
                            PriceData = new SessionLineItemPriceDataOptions
                            {
                                UnitAmount = (long)(offerAmount * 100), 
                                Currency = "egp",
                                ProductData = new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name = $"استثمار في {project.Data.ProjectTitle}"
                                }
                            },
                            Quantity = 1
                        }
                    },
                    Mode = "payment",
                    SuccessUrl = $"{_configuration["Stripe:SuccessUrl"]}?session_id={{CHECKOUT_SESSION_ID}}",
                    CancelUrl = _configuration["Stripe:CancelUrl"],
                    ClientReferenceId = user.Id,
                    Metadata = new Dictionary<string, string>
                    {
                        { "projectId", request.ProjectId.ToString() },
                        { "offerId", request.OfferId.ToString() ?? "" }
                    }
                };

                var service = new SessionService();
                var session = await service.CreateAsync(options);
                return Ok(new ValidationResult<string>
                {
                    Data = session.Id,
                    IsValid = true,
                    ErrorMessage = null
                });

            }
            catch (StripeException ex)
            {
                return StatusCode(500, new ValidationResult<string>
                {
                    IsValid = false,
                    ErrorMessage = $"Stripe Error: {ex.Message}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ValidationResult<string>
                {
                    IsValid = false,
                    ErrorMessage = $"خطأ عام: {ex.Message}"
                });
            }
        }

    }
}
