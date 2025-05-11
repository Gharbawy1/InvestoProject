using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.Entities.IRepository
{
    public interface IInvestorRepository
    {
        Task<decimal> GetInvestmentMaxAmount(string investorId);
    }
}
