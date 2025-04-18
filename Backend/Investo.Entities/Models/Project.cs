using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public string ProjectTitle { get; set; }
        [MaxLength(100)]
        public string Subtitle { get; set; }
        [MaxLength(200)]
        public string ProjectLocation { get; set; }
        public string ProjectImageURL { get; set; }
        //public byte[]? ProjectVideo { get; set; }// optional
        public decimal FundingGoal { get; set; }
        public string FundingExchange { get; set; }
        //public List<string> AdditionalNeeds { get; set; } // Multiple entries

        public ProjectStatus Status { get; set; } = ProjectStatus.Pending;
        
        public string ProjectVision { get; set; }
        //public bool PackagesInvestment { get; set; }
        //public bool InvestmentNegotiation { get; set; }
        public string ProjectStory { get; set; }
        public string CurrentVision { get; set; }
        public string Goals { get; set; }
        //public byte[] BankAccountInformation { get; set; }// the bank account that money will be transferred to

        // Relationships
        public byte CategoryId { get; set; }
        public Category Category { get; set; } // One-to-one with Category

        public string OwnerId { get; set; } // Foreign key to BusinessOwner (inherits from User)
        [ForeignKey("OwnerId")]
        public BusinessOwner Owner { get; set; }
    }
    public enum ProjectStatus
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
