using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.Models
{
    public class Investor:ApplicationUser
    {
        [MaxLength(250)]
        public string RiskTolerance { get; set; }
        public string InvestmentGoals { get; set; } //
        public PersonInfo PersonInfo { get; set; } = new PersonInfo();
        public decimal MinInvestmentAmount { get; set; }
        public decimal MaxInvestmentAmount { get; set; }

        public static int PageViews { get; set; }
        
        public string AccreditationStatus { get; set; }
        public decimal NetWorth { get; set; }
        public decimal AnnualIncome { get; set; }

        //public List<Category> PreferredIndustries { get; set; } // not navigation properity
        //public GeographicFocus GeographicFocus { get; set; } = GeographicFocus.local;
        //public string LiquidityPreferences { get; set; }
        //public List<string> IPAddressLogs { get; set; } = new List<string>();
        //public string TaxID { get; set; }
        //public byte[] BankAccountDetails { get; set; }
        //public byte[] SourceOfFundsDocument { get; set; } // إثبات دخل

        //[MaxLength(100)]
        //public string KYCAMLStatus { get; set; }
        //public List<string> InvestmentHistory { get; set; } = new List<string>();
        //public ICollection<Project> SavedProjects { get; set; } = new HashSet<Project>();
        // not navigation properity M2M
        // navigation properties
        public ICollection<Offer> Offers { get; set; } = new HashSet<Offer>(); // list of offers he made to different projects
        //public List<Message> Messages { get; set; }
    }
    //public enum GeographicFocus
    //{
    //    local,
    //    regional,
    //    global
    //}
}
