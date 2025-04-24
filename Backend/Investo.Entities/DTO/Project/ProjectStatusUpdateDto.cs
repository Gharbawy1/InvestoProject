using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.Entities.DTO.Project
{
    public class ProjectStatusUpdateDto
    {
        public int ProjectId { get; set; }
        public string Status { get; set; }
    }
}
