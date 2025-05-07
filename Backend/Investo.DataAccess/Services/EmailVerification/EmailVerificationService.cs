using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentEmail.Core;
using Google;
using Investo.DataAccess.ApplicationContext;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Investo.DataAccess.Services.EmailVerification
{
    public class EmailVerificationService : IEmailVerificationService
    {
        private readonly IFluentEmail _fluentEmail;
        private readonly IEmailServiceRepository _tokenRepo;
        private readonly UserManager<ApplicationUser> _userManager;

        public EmailVerificationService(
            IFluentEmail fluentEmail,
            IEmailServiceRepository tokenRepo,
            UserManager<ApplicationUser> userManager)
        {
            _fluentEmail = fluentEmail;
            _tokenRepo = tokenRepo;
            _userManager = userManager;
        }

        public async Task SendVerificationEmailAsync(ApplicationUser user)
        {
            //var token = Guid.NewGuid().ToString();
            var generatedConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var tokenEntity = new EmailVerificationToken
            {
                Token = generatedConfirmationToken,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };

            await _tokenRepo.AddTokenAsync(tokenEntity);
            var encodedToken = Uri.EscapeDataString(generatedConfirmationToken);
            var verificationUrl = $"https://investo.runasp.net/api/account/verify-email?userId={user.Id}&token={encodedToken}";

            await _fluentEmail
                .To(user.Email)
                .Subject("Verify your email")
                .Body($"Click the link to verify your email: {verificationUrl}", isHtml: false)
                .SendAsync();
        }

        public async Task<bool> VerifyEmailAsync(ApplicationUser applicationUser,string token)
        {
            var tokenEntity = await _tokenRepo.GetTokenByTokenAsync(token);

            if (tokenEntity == null) return false;

            var result = await _userManager.ConfirmEmailAsync(applicationUser, token);
            if (!result.Succeeded)
            {
                return false;
            }
            tokenEntity.IsUsed = true;
            await _tokenRepo.SaveChangesAsync();
            return true;
        }

    }


}
