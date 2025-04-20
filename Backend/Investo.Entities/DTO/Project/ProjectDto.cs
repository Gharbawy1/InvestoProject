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
    public class ProjectDto
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public string ProjectTitle { get; set; }
        [MaxLength(100)]
        public string Subtitle { get; set; }
        [MaxLength(200)]
        public string ProjectLocation { get; set; }
        public IFormFile ProjectImage { get; set; }
        public decimal FundingGoal { get; set; }
        public string FundingExchange { get; set; }
        public ProjectStatus Status { get; set; } = ProjectStatus.Pending;
        public string ProjectVision { get; set; }
        public string ProjectStory { get; set; }
        public string CurrentVision { get; set; }
        public string Goals { get; set; }
        public byte CategoryId { get; set; } // foreign key to category
        public string OwnerId { get; set; } // Foreign key to BusinessOwner (inherits from User)
    }
}
