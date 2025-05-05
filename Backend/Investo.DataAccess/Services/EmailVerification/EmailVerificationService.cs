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
        public EmailVerificationService(
            IFluentEmail fluentEmail,
            IEmailServiceRepository tokenRepo)
        {
            _fluentEmail = fluentEmail;
            _tokenRepo = tokenRepo;
        }

        public async Task SendVerificationEmailAsync(ApplicationUser user)
        {
            var token = Guid.NewGuid().ToString();

            var tokenEntity = new EmailVerificationToken
            {
                Token = token,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };

            await _tokenRepo.AddTokenAsync(tokenEntity);

            var verificationUrl = $"https://yourdomain.com/api/account/verify-email?token={token}";

            await _fluentEmail
                .To(user.Email)
                .Subject("Verify your email")
                .Body($"Click the link to verify your email: {verificationUrl}", isHtml: false)
                .SendAsync();
        }

        public async Task<bool> VerifyEmailAsync(string token)
        {
            var tokenEntity = await _tokenRepo.GetTokenByTokenAsync(token);

            if (tokenEntity == null) return false;

            tokenEntity.IsUsed = true;
            tokenEntity.User.EmailConfirmed = true;

            await _tokenRepo.SaveChangesAsync(); 

            return true;
        }

    }


}
