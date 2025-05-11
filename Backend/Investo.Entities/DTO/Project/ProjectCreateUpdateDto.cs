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
        //public ProjectStatus Status { get; set; } = ProjectStatus.Pending; ----> the Business owner won't give me
                                                                                // the project status when creating or updating project
        public string ProjectVision { get; set; }
        public string ProjectStory { get; set; }
        public string CurrentVision { get; set; }
        public string Goals { get; set; }
        public byte CategoryId { get; set; }
        public string OwnerId { get; set; }

        public IFormFile? ArticlesOfAssociation { get; set; }
        public IFormFile? CommercialRegistryCertificate { get; set; }
        public IFormFile? TextCard { get; set; }
    }
}
