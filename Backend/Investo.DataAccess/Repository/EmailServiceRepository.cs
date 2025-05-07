using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google;
using Investo.DataAccess.ApplicationContext;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Investo.DataAccess.Repository
{
    public class EmailServiceRepository : IEmailServiceRepository
    {
        private readonly CoreEntitiesDbContext _context;

        public EmailServiceRepository(CoreEntitiesDbContext context)
        {
            _context = context;
        }

        public async Task AddTokenAsync(EmailVerificationToken token)
        {
            await _context.EmailVerificationTokens.AddAsync(token);
            await _context.SaveChangesAsync();
        }

        public async Task<EmailVerificationToken?> GetTokenByTokenAsync(string token)
        {
            var getted = await _context.EmailVerificationTokens
       .Where(t => t.Token == token)
       .Include(t => t.User)
       .FirstOrDefaultAsync();

            if (token == getted.Token)
            {
                Console.WriteLine("token == getted");
            }
            else
            {
                Console.WriteLine(token + "==================\n");
                Console.WriteLine(getted.Token + "==================\n");
            }
            return getted;

        }
    


        public async Task RemoveTokenAsync(EmailVerificationToken token)
        {
            _context.EmailVerificationTokens.Remove(token);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }

}
