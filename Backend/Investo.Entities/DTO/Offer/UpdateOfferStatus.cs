using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Offer
{
    public class UpdateOfferStatus
    {
        public int OfferId { get; set; }
       public string Status { get; set; } = string.Empty;// will handle conversion from OfferSatus(int) to string
    }
}
