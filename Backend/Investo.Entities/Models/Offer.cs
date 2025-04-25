using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.Models
{
    public class Offer
    {
        // Primary Key
        public int Id { get; set; }

        // ========== FINANCIAL TERMS ==========
        [Range(0.01, double.MaxValue, ErrorMessage = "Offer amount must be positive")]
        public decimal OfferAmount { get; set; }

        [Range(0, 100, ErrorMessage = "Equity must be 0-100%")]
        public decimal EquityPercentage { get; set; }

        [Range(0, 100, ErrorMessage = "Profit share must be 0-100%")]
        public decimal ProfitShare { get; set; }

        // ========== OFFER DETAILS ==========
        public InvestmentType InvestmentType { get; set; }

        [Required]
        [StringLength(2000)]
        public string OfferTerms { get; set; }

        [StringLength(1000)]
        public string? AdditionalServices { get; set; }

        // ========== STATUS & TIMING ==========
        public OfferStatus Status { get; set; } = OfferStatus.Pending;
        public DateTime OfferDate { get; set; } = DateTime.UtcNow;

        public DateTime ExpirationDate { get; set; }

        // ========== NOTES & TRACKING ==========
        //[StringLength(4000)]
        //public string? Notes { get; set; }

        // ========== RELATIONSHIPS ==========
        // Who Send Request
        public int InvestorId { get; set; }
        public Investor Investor { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; }

    }
    public enum InvestmentType
    {
        Equity,
        Debt,
        //ConvertibleNote,
        ProfitShare,
        //SAFE,
        //Custom
    }
    // offer.Status = OfferStatus.Accepted;
    // _context.savech()
    public enum OfferStatus
    {
        Rejected,
        Accepted,
        Pending,
        //Countered,    // Owner made counter-offer
        //Expired,
        //Withdrawn,    // Investor canceled
        //UnderReview,
        //negotiated    // Legal/compliance check
    }
}
