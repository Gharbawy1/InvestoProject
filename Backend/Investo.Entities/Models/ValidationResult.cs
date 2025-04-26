using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.Models
{
    public class ValidationResult<T>
    {
        public T Data { get; set; }
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; }
    }
}
