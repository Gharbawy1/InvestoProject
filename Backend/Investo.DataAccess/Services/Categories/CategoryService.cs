using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.DataAccess.Services.Interfaces;
using Investo.Entities.DTO.Category;
using Investo.Entities.IRepository;
using Investo.Entities.Models;

namespace Investo.DataAccess.Services.Categories
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllCategories()
        {
            var categories = await _categoryRepository.GetAll();
            return categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name
            });
        }

        public async Task<CategoryDTO> GetCategoryById(byte id)
        {
            var category = await _categoryRepository.GetById(id);
            if (category == null) return null;

            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        public async Task CreateCategory(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name
            };

            await _categoryRepository.Add(category);
        }

        public async Task UpdateCategory(byte id, UpdateCategoryDTO dto)
        {
            var category = await _categoryRepository.GetById(id);
            if (category == null) return;

            category.Name = dto.Name;

            await _categoryRepository.Update(category);
        }

        public async Task DeleteCategory(byte id)
        {
            await _categoryRepository.Delete(id);
        }

        public Task<bool> IsValidCategory(byte id)
        {
            return _categoryRepository.IsValidCategory(id);
        }
    }

}
