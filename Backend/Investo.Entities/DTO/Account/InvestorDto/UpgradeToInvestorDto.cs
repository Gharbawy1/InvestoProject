using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Account.InvestorDto
{
    public class UpgradeToInvestorDto
    {
        [MaxLength(250)]
        public string RiskTolerance { get; set; }
        public string InvestmentGoals { get; set; }

        // Person Data and we will map it
        public IFormFile NationalIDImageFrontURL { get; set; }
        public IFormFile NationalIDImageBackURL { get; set; }
        public string NationalID { get; set; }
        public IFormFile? ProfilePictureURL { get; set; }

        public decimal MinInvestmentAmount { get; set; }
        public decimal MaxInvestmentAmount { get; set; }

        //public static int PageViews { get; set; }

        public string AccreditationStatus { get; set; }
        public decimal NetWorth { get; set; }
        public decimal AnnualIncome { get; set; }
    }
}
