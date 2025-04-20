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
        public string? NationalIDImageFrontURL { get; set; }
        public string? NationalIDImageBackURL { get; set; }
        public string NationalID { get; set; }
    }
}
