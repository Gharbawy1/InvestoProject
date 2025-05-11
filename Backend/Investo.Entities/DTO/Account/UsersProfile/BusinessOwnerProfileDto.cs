using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Account.UsersProfile
{
    public class BusinessOwnerProfileDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string? ProfilePictureURL { get; set; }
        public string? Bio { get; set; }
        public string? Address { get; set; }
        public string PhoneNumber { get; set; }

        // BusinessOwner-specific fields
        //public int? ProjectId { get; set; }
        //public ProjectDto? Project { get; set; }
        //public List<OfferDto> Offers { get; set; }
    }
}
