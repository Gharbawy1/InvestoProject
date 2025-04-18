using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.Models
{
    public class ApplicationUser : IdentityUser
    {
        
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public string? ProfilePictureURL { get; set; }
        [MaxLength(300)]
        public string? Bio { get; set; }
        public string? Address { get; set; }
        
    }

    // In Idenetity User 
    //public enum Role
    //{
    //    user,
    //    BusinessOwner,
    //    Investor,
    //    admin
    //}
}
