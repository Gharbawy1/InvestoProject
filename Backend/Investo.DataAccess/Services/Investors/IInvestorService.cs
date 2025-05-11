using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.DataAccess.Services.Investors
{
    public interface IInvestorService
    {
        Task<decimal> GetInvestmentMaxValue(string investorId);
    }
}
