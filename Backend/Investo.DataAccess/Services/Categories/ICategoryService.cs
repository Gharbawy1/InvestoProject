using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Category;
using Investo.Entities.Models;

namespace Investo.DataAccess.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<ValidationResult<IEnumerable<CategoryDTO>>> GetAllCategoriesAsync();
        Task<ValidationResult<CategoryDTO>> GetCategoryByIdAsync(byte id);
        Task<ValidationResult<CategoryDTO>> GetCategoryByNameAsync(string Name);
        Task<ValidationResult<CategoryDTO>> CreateCategoryAsync(CreateCategoryDto dto);
        Task<ValidationResult<CategoryDTO>> UpdateCategory(byte id, UpdateCategoryDto dto);
        Task<ValidationResult<bool>> DeleteCategory(byte id);
        Task<bool> IsValidCategory(byte id);
    }
}
