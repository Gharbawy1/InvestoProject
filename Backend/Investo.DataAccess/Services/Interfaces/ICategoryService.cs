using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Category;

namespace Investo.DataAccess.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAllCategories();
        Task<CategoryDTO> GetCategoryById(byte id);
        Task CreateCategory(CreateCategoryDto dto);
        Task UpdateCategory(byte id, UpdateCategoryDTO dto);
        Task DeleteCategory(byte id);
    }
}
