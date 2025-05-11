using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.oAuth
{
    public class OAuthLoginResponse
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public string UserName { get; set; }
        public IList<string> Roles { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string profilePicture { get; set; }
    }
}
