using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Account.InvestorDto
{
    public class InvestorRegisterResponseDto
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public IList<string> Roles { get; set; }
        public string UserId { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsEmailConfirmed { get; set; }
        
    }
    // TODO : Complete the Business Owner DTO for regiestration 
    // TODO : Separate the registration for BO,Investor endpoints => /api/account/register-investor , /api/account/register-bo

    // TODO : Profile endpoint ! and add bio,address,..........
    // What I Complete , the Usual User regestration and DTO and the login
}
