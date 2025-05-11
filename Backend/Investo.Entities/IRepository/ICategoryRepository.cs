using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.Models;

namespace Investo.Entities.IRepository
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAll();
        Task<Category> GetById(byte id);
        Task<Category> GetByNameAsync(string Name);
        Task Add(Category category);
        Task Update(Category category);
        Task Delete(byte id);
        Task<bool> IsValidCategory(byte id);
    }
}
