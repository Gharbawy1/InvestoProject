using Investo.DataAccess.Services.Interfaces;
using Investo.Entities.DTO.Category;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Investo.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllCategoriesAsync();
            if (!result.IsValid)
            {
                return BadRequest(new ValidationResult<IEnumerable<CategoryDTO>>(null, false, result.ErrorMessage));
            }
            return Ok(result.Data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(byte id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            if (!result.IsValid)
            {
                return NotFound(new ValidationResult<CategoryDTO>(null, false, result.ErrorMessage));
            }
            return Ok(result.Data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            var result = await _categoryService.GetCategoryByNameAsync(dto.Name);
            if (result.IsValid)
            {
                var validationResult = new ValidationResult<CategoryDTO>(null, false, $"Category with name {dto.Name} is already taken");
                return BadRequest(validationResult);
            }

            var createResult = await _categoryService.CreateCategoryAsync(dto);

            if (!createResult.IsValid)
            {
                return BadRequest(new ValidationResult<CategoryDTO>(null, false, createResult.ErrorMessage));
            }

            return StatusCode(201, new ValidationResult<CategoryDTO>(createResult.Data, true, "Category created successfully"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(byte id, [FromBody] UpdateCategoryDto dto)
        {
            var result = await _categoryService.GetCategoryByNameAsync(dto.Name);
            if (result.IsValid)
            {
                var validationResult = new ValidationResult<CategoryDTO>(null, false, $"Category with name {dto.Name} is already taken");
                return BadRequest(validationResult);
            }

            var updateResult = await _categoryService.UpdateCategory(id, dto);

            if (!updateResult.IsValid)
            {
                return BadRequest(new ValidationResult<CategoryDTO>(null, false, updateResult.ErrorMessage));
            }

            return Ok(new ValidationResult<CategoryDTO>(updateResult.Data, true, "Category updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(byte id)
        {
            var result = await _categoryService.DeleteCategory(id);
            if (!result.IsValid)
            {
                return NotFound(new ValidationResult<object>(null, false, result.ErrorMessage));
            }

            return Ok(new ValidationResult<object>(null, true, "Category deleted successfully"));
        }
    }
}
