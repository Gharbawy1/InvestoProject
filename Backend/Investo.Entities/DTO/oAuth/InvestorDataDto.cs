using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.oAuth
{
    public class InvestorDataDto
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [Required]
        public DateTime BirthDate { get; set; }

        [Required]
        [MinLength(14, ErrorMessage = "NationalID must be at least 14 characters")]
        public string NationalID { get; set; }

        [Required]
        public IFormFile NationalIDImageFront { get; set; }

        [Required]
        public IFormFile NationalIDImageBack { get; set; }

        [Required]
        [MaxLength(250)]
        public string RiskTolerance { get; set; }

        [Required]
        public string InvestmentGoals { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "MinInvestmentAmount must be non-negative")]
        public decimal MinInvestmentAmount { get; set; }

        [Required]
        [Range(0.01,double.MaxValue, ErrorMessage = "MaxInvestmentAmount must be non-negative")]
        public decimal MaxInvestmentAmount { get; set; }

        [Required]
        [MaxLength(100)]
        public string AccreditationStatus { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "NetWorth must be non-negative")]
        public decimal NetWorth { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "AnnualIncome must be non-negative")]
        public decimal AnnualIncome { get; set; }
    }
}
