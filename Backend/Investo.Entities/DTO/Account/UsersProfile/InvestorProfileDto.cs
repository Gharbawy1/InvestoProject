using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Account.UsersProfile
{
    public class InvestorProfileDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string? ProfilePictureURL { get; set; }
        public string? Bio { get; set; }
        public string? Address { get; set; }
        public string PhoneNumber { get; set; }
        public IList<string> Roles { get; set; }

        // Investor-specific fields
        public string RiskTolerance { get; set; }
        public string InvestmentGoals { get; set; }
        public decimal MinInvestmentAmount { get; set; }
        public decimal MaxInvestmentAmount { get; set; }
        public string AccreditationStatus { get; set; }
        public decimal NetWorth { get; set; }
        public decimal AnnualIncome { get; set; }
        public string NationalID { get; set; }
        //public List<OfferDto> Offers { get; set; }
    }
}
