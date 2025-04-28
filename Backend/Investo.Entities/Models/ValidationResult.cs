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
        public ValidationResult()
        { }


        public ValidationResult(T data, bool isvalid, string errormessage)
        {
            Data = data;
            IsValid = isvalid;
            ErrorMessage = errormessage;
        }
    }
}
