using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Http;

namespace Investo.Entities.DTO.Project
{
    public class ProjectCreateUpdateDto
    {
        public string ProjectTitle { get; set; }
        public string Subtitle { get; set; }
        public string ProjectLocation { get; set; }
        public IFormFile? ProjectImage { get; set; }
        public decimal FundingGoal { get; set; }
        public string FundingExchange { get; set; }
        public string Status { get; set; }
        public string ProjectVision { get; set; }
        public string ProjectStory { get; set; }
        public string CurrentVision { get; set; }
        public string Goals { get; set; }
        public int CategoryId { get; set; }
        public int OwnerId { get; set; }
    }
}
