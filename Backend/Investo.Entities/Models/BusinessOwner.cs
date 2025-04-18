using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.Models
{
    public class BusinessOwner:ApplicationUser
    {
        //[MaxLength(100)]
        //public string KYCStatus { get; set; }
        public PersonInfo PersonInfo { get; set; }
        public string PassportDocumentURL { get; set; }
        public string NationalIDDocumentURL { get; set; }
        public DateTime LastActivity { get; set; }

        // navigation property
        public int ProjectId { get; set; }
        public Project Project { get; set; }// on Delete : method// if we remove BO project will be removed 

        public ICollection<Offer> Offers { get; set; } = new HashSet<Offer>();
        // he will receive into his dashboard
        //public List<Message> Messages { get; set; } // he will send
    }
}
