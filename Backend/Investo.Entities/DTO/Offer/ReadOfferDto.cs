using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.Entities.DTO.Offer
{
    public class ReadOfferDto
    {
        public int OfferId { get; set; }
        public DateTime OfferDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public OfferStatus Status { get; set; } = OfferStatus.Pending;

        public int ProjectId { get; set; }

        public int InvestorId { get; set; }

        public InvestorBasicInfoDto Investor { get; set; }
    }

}
