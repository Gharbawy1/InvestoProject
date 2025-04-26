using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.Entities.DTO.Offer
{
    public class CreateOrUpdateOfferDto
    {
        [Range(0.01, double.MaxValue, ErrorMessage = "Offer amount must be greater than zero.")]
        public decimal OfferAmount { get; set; }

        [Required]
        public InvestmentType InvestmentType { get; set; }

        // Optional - based on InvestmentType
        [Range(0, 100, ErrorMessage = "Equity percentage must be between 0 and 100.")]
        public decimal? EquityPercentage { get; set; }

        [Range(0, 100, ErrorMessage = "Profit share must be between 0 and 100.")]
        public decimal? ProfitShare { get; set; }

        [Required]
        [StringLength(2000, ErrorMessage = "Offer terms must not exceed 2000 characters.")]
        public string OfferTerms { get; set; }

        [Required]
        public int ProjectId { get; set; }
    }

}
