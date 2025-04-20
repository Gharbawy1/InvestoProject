using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.DTO.Category
{
    public class CategoryDTO
    {
        public byte Id { get; set; }
        [MaxLength(100)]
        public string Name { get; set; }
    }
}
