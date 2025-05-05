using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.oAuth
{
    public class GoogleLoginDto
    {
        [Required]
        public string IdToken { get; set; }
        [Required]
        [RegularExpression("^(User|Investor|BusinessOwner)$", ErrorMessage = "Role must be User, Investor, or BusinessOwner")]
        public string? Role {  get; set; }
        public InvestorDataDto? InvestorData { get; set; }
        public BusinessOwnerDataDto? BusinessOwnerData { get; set; }
    }
}
