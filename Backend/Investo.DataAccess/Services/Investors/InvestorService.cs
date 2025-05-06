using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.IRepository;
using Investo.Entities.Models;

namespace Investo.DataAccess.Services.Investors
{
    public class InvestorService : IInvestorService
    {
        private readonly IInvestorRepository _investorRepository;

        public InvestorService(IInvestorRepository investorRepository)
        {
            _investorRepository = investorRepository;
        }

        public async Task<decimal> GetInvestmentMaxValue(string investorId)
        {
            var MaxInvestmentVal =  await _investorRepository.GetInvestmentMaxAmount(investorId);
            if (MaxInvestmentVal==default(decimal)) return 0;
            
            return MaxInvestmentVal;
        }
    }
}
