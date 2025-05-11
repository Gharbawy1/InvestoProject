using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.oAuth
{
    public class BusinessOwnerDataDto
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [Required]
        public DateTime BirthDate { get; set; }

        [Required]
        //[MinLength(14, ErrorMessage = "NationalID must be at least 14 characters")]
        public string NationalID { get; set; }

        [Required]
        public IFormFile NationalIDImageFrontURL { get; set; }

        [Required]
        public IFormFile NationalIDImageBackURL { get; set; }
    }
}
