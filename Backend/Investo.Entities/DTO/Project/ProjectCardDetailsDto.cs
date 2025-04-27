using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Project
{
    public class ProjectCardDetailsDto
    {
        public int Id { get; set; }
        public string ProjectTitle { get; set; }
        public string Subtitle { get; set; }
        public string ProjectImageUrl { get; set; }
        public decimal FundingGoal { get; set; }
        public string CategoryName { get; set; }
        public string OwnerName { get; set; }
        public decimal raisedFunds { get; set; } // all accepted offers prices - funding goal
    }
}
