using Investo.Entities.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Account.InvestorDto
{
    // TODO : when upgrade receive id for registerd user and extra data
    public class InvestorRegisterDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? PhoneNumber { get; set; }



        [Required]
        [PasswordPropertyText]
        public string? Password { get; set; }

        [Compare("Password", ErrorMessage = "The Password and confirmation password do not match.")]
        public string? ConfirmPassword { get; set; }
        [MaxLength(250)]
        public string RiskTolerance { get; set; }
        public string InvestmentGoals { get; set; }

        // Person Data and we will map it
        public IFormFile NationalIDImageFrontURL { get; set; }
        public IFormFile NationalIDImageBackURL { get; set; }
        public string NationalID { get; set; }

        public decimal MinInvestmentAmount { get; set; }
        public decimal MaxInvestmentAmount { get; set; }

        //public static int PageViews { get; set; }

        public string AccreditationStatus { get; set; }
        public decimal NetWorth { get; set; }
        public decimal AnnualIncome { get; set; }
    }
}
