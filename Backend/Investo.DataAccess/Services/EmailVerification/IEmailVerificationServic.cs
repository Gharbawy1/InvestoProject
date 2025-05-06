using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.DataAccess.Services.EmailVerification
{
    public interface IEmailVerificationService
    {
        Task SendVerificationEmailAsync(ApplicationUser user);
        Task<bool> VerifyEmailAsync(string token);
    }

}
