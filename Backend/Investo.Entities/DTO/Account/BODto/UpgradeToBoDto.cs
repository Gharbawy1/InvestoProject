using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Account.BODto
{
    public class UpgradeToBoDto
    {
        public string NationalID { get; set; }
        public IFormFile NationalIDImageFrontURL { get; set; }
        public IFormFile NationalIDImageBackURL { get; set; }
        public IFormFile ProfilePictureURL { get; set; }
    }
}
