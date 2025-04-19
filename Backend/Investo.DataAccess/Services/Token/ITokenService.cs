using Investo.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.DataAccess.Services.Token
{
    public interface ITokenService
    {
        Task<string> CreateToken(ApplicationUser appUser);

    }
}
