using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Offer
{
    public class InvestorBasicInfoDto
    {
        public string FirstName { get; set; } // From (ApplicationUser)
        public string LastName { get; set; } // From (ApplicationUser)
        public string? Bio { get; set; }     // From ApplicationUser
        public string? ProfilePictureUrl { get; set; } // From ApplicationUser

        // Financial / Investment-related info of investor
        public string RiskTolerance { get; set; }
        public string InvestmentGoals { get; set; }
        public decimal MinInvestmentAmount { get; set; }
        public decimal MaxInvestmentAmount { get; set; }
        public decimal NetWorth { get; set; }
        public decimal AnnualIncome { get; set; }
        public string AccreditationStatus { get; set; }
    }

}
