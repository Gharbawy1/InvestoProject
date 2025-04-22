using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.Entities.DTO.Project
{
    public class ProjectRequestReviewDto
    {
        // Project properties
        public int Id { get; set; }
        public string ProjectTitle { get; set; }
        public string Subtitle { get; set; }
        public string ProjectLocation { get; set; }
        public string ProjectImageURL { get; set; }
        public decimal FundingGoal { get; set; }
        public string FundingExchange { get; set; }
        public string ProjectVision { get; set; }
        public string ProjectStory { get; set; }
        public string CurrentVision { get; set; }
        public string Goals { get; set; }
        public byte CategoryId { get; set; }
        public string OwnerId { get; set; }
        public ProjectStatus Status { get; set; }

        // Basic BusinessOwner info
        public string Bio { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string FullName { get; set; } // PersonInfo.FirstName + " " + PersonInfo.LastName
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string ProfilePictureURL { get; set; }
        public string Address { get; set; }
    }

}
