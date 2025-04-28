using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Investo.DataAccess.ApplicationContext;
using Investo.DataAccess.Services.Interfaces;
using Investo.Entities.DTO.Category;
using Investo.Entities.DTO.Offer;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Investo.DataAccess.Services.Categories
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly CoreEntitiesDbContext _context;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, CoreEntitiesDbContext context, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ValidationResult<IEnumerable<CategoryDTO>>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAll();

            if (categories == null || !categories.Any())
            {
                return new ValidationResult<IEnumerable<CategoryDTO>>
                {
                    Data = null,
                    ErrorMessage = "No categories found.",
                    IsValid = false
                };
            }
            // map category with categoryDto using Automapper
            var categoryDto = _mapper.Map<List<CategoryDTO>>(categories);

          
            return new ValidationResult<IEnumerable<CategoryDTO>>
            {
                Data = categoryDto,
                ErrorMessage = null,
                IsValid = true
            };
        }

        public async Task<ValidationResult<CategoryDTO>> GetCategoryByIdAsync(byte id)
        {
            var category = await _categoryRepository.GetById(id);

            if (category == null)
            {
                return new ValidationResult<CategoryDTO>
                {
                    Data = null,
                    ErrorMessage = $"Category with Id {id} not found.",
                    IsValid = false
                };
            }
            // map category with categoryDto using Automapper
            var categoryDTO = _mapper.Map<CategoryDTO>(category);
           
            return new ValidationResult<CategoryDTO>
            {
                Data = categoryDTO,
                ErrorMessage = null,
                IsValid = true
            };
        }

        public async Task<ValidationResult<CategoryDTO>> GetCategoryByNameAsync(string name)
        {
            var category = await _categoryRepository.GetByNameAsync(name);

            if (category == null)
            {
                return new ValidationResult<CategoryDTO>
                {
                    Data = null,
                    ErrorMessage = $"Category with Name {name} not found.",
                    IsValid = false
                };
            }
            // map category with categoryDto using Automapper
            var categoryDtos = _mapper.Map<CategoryDTO>(category);

            return new ValidationResult<CategoryDTO>
            {
                Data = categoryDtos,
                ErrorMessage = null,
                IsValid = true
            };
        }


        public async Task<ValidationResult<CategoryDTO>> CreateCategoryAsync(CreateCategoryDto dto)
        {
            var isCategoryExist = await _categoryRepository.GetByNameAsync(dto.Name);
            if (isCategoryExist != null)
            {
                return new ValidationResult<CategoryDTO>
                {
                    Data = null,
                    ErrorMessage = $"Category with the name {dto.Name} already exists.",
                    IsValid = false
                };
            }

            var categoryEntity = _mapper.Map<Category>(dto);

            await _categoryRepository.Add(categoryEntity);

            var result = new CategoryDTO
            {
                Id = categoryEntity.Id,
                Name = categoryEntity.Name
            };

            var successCreationValidationResult = new ValidationResult<CategoryDTO>
            {
                Data = result,
                ErrorMessage = null,
                IsValid = true
            };

            return successCreationValidationResult;
        }

        public async Task<ValidationResult<CategoryDTO>> UpdateCategory(byte id, UpdateCategoryDto dto)
        {
            var category = await _categoryRepository.GetById(id);
            if (category == null)
            {
                return new ValidationResult<CategoryDTO>
                {
                    Data = null,
                    ErrorMessage = $"Category with Id {id} not found.",
                    IsValid = false
                };
            }
            // map category with categoryDto using Automapper
            _mapper.Map(dto, category);
            await _categoryRepository.Update(category);
            var updatedCategoryDTO = _mapper.Map<CategoryDTO>(category);

            return new ValidationResult<CategoryDTO>
            {
                Data = updatedCategoryDTO,
                ErrorMessage = null,
                IsValid = true
            };

        }


        public async Task<ValidationResult<bool>> DeleteCategory(byte id)
        {
            var category = await _categoryRepository.GetById(id);
            if (category == null)
            {
                return new ValidationResult<bool>
                {
                    Data = false,
                    ErrorMessage = $"Category with Id {id} not found.",
                    IsValid = false
                };
            }
            var hasRelatedData = await _context.Projects
          .AnyAsync(p => p.CategoryId == id);
            if (hasRelatedData)
            {
                return new ValidationResult<bool>
                {
                    Data = false,
                    ErrorMessage = "Cannot delete category because there are related projects.",
                    IsValid = false
                };
            }

            await _categoryRepository.Delete(id);

            return new ValidationResult<bool>
            {
                Data = true,
                ErrorMessage = null,
                IsValid = true
            };
        }


        public Task<bool> IsValidCategory(byte id)
        {
            return _categoryRepository.IsValidCategory(id);
        }
    }
}
