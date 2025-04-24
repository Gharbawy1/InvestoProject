using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Account
{
    public class BORegisterDto
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

        // Person Data and we will map it
        public string NationalID { get; set; }

        public IFormFile NationalIDImageFrontURL { get; set; }
        public IFormFile NationalIDImageBackURL { get; set; }
        public IFormFile ProfilePictureURL { get; set; }

    }
}
