using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.Models
{
    public class PersonInfo
    {
        [MaxLength(150)]
        public string FullLegalName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string NationalIDImageFrontURL { get; set; }
        public string NationalIDImageBackURL { get; set; }
        public string NationalIDL { get; set; }
    }
}
