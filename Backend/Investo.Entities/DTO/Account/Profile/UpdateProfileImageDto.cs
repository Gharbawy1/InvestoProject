using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Account.Profile
{
    public class UpdateProfileImageDto
    {
        public IFormFile profilePicture { get; set; }
    }
}
