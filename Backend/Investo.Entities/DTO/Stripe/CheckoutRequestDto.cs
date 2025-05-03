using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Stripe
{
    public class CheckoutRequestDto
    {
        public int ProjectId { get; set; }
        public int OfferId { get; set; } 
    }
}
