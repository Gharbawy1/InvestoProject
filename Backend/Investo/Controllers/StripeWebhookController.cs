using Investo.Entities.IRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
namespace Investo.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StripeWebhookController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IOfferRepository _offerRepository;

        public StripeWebhookController(IConfiguration configuration, IOfferRepository offerRepository)
        {
            _configuration = configuration;
            _offerRepository = offerRepository;
        }

        [HttpPost]
        [Route("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var secret = _configuration["Stripe:WebhookSecret"];
            Event stripeEvent;

            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    secret,
                    throwOnApiVersionMismatch:false //  this is a temporary soultion, we have to use stable API Version
                );
            }
            catch (StripeException e)
            {
                return BadRequest($"Webhook Error: {e.Message}");
            }

            if (stripeEvent.Type == Events.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Session;

                if (session.Metadata != null && session.Metadata.TryGetValue("offerId", out string offerIdStr))
                {
                    if (int.TryParse(offerIdStr, out int offerId))
                    {
                        var success = await _offerRepository.SetOfferAsPaidAsync(offerId);
                        if (!success)
                        {
                            // Optional: Log or notify that marking as paid failed
                            return StatusCode(500, "فشل تحديث حالة العرض");
                        }
                    }
                }
            }

            return Ok();
        }
    }
}
