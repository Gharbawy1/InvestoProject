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
        string Status { get; set; } = string.Empty;// witll handle conversion from OfferSatus(int) to string
    }
}
