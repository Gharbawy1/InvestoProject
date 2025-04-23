using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Account
{
    // This DTO For the Usual regestration if the user regisetr as a user 
    public class RegisterDto
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

        // NOTE : Bio , address, Profile Pic will be in the profile not in regestration process
    }
}
