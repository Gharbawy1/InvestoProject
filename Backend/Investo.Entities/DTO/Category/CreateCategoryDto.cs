using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Category
{
    public class CreateCategoryDto
    {
        [MaxLength(100, ErrorMessage = "Name can't exceed 100 characters")]
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
    }

}
