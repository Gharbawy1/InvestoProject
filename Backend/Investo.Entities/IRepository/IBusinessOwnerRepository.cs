﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Investo.Entities.IRepository
{
    public interface IBusinessOwnerRepository
    {
        Task<bool> ExistsAsync(string ownerId);
    }
}
