using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Http;

namespace Investo.Entities.DTO.Project
{
    public class ProjectReadDto
    {
        public int Id { get; set; }
        public string ProjectTitle { get; set; }
        public string Subtitle { get; set; }
        public string ProjectLocation { get; set; }
        public string ProjectImageUrl { get; set; }
        public decimal FundingGoal { get; set; }
        public string FundingExchange { get; set; }
        public ProjectStatus Status { get; set; } = ProjectStatus.Pending;
        public string ProjectVision { get; set; }
        public string ProjectStory { get; set; }
        public string CurrentVision { get; set; }
        public string Goals { get; set; }
        public byte CategoryId { get; set; }
        public string OwnerId { get; set; }
    }

}
