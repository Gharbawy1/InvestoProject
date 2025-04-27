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
        public decimal OfferAmount { get; set; }

        public DateTime ExpirationDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string InvestmentType {  get; set; } = string.Empty;

        public int ProjectId { get; set; }

        public string InvestorId { get; set; }

        public InvestorBasicInfoDto Investor { get; set; }
    }

}
