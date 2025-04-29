using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.Models
{
    // Temporary for test and we will handle it 
    public class UserCreationException:Exception
    {
        public UserCreationException(string message) : base(message) { }
    }
}
