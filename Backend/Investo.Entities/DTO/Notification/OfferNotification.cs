using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Notification
{
    public class OfferNotification
    {
        public int OfferId { get; set; }
        public DateTime OfferDate { get; set; }
        public decimal OfferAmount { get; set; }

        public DateTime ExpirationDate { get; set; }
        public string Status { get; set; }
        public string InvestmentType { get; set; }

        public int ProjectId { get; set; }
        public string ProjectName { get; set; }

        public string InvestorId { get; set; }
        public string InvestorName { get; set; }
    }
}
