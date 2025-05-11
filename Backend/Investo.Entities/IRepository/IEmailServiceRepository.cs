using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.Entities.IRepository
{
    public interface IEmailServiceRepository
    {
        Task AddTokenAsync(EmailVerificationToken token);
        Task<EmailVerificationToken?> GetTokenByTokenAsync(string token);
        Task RemoveTokenAsync(EmailVerificationToken token);
        Task SaveChangesAsync();
    }

}
