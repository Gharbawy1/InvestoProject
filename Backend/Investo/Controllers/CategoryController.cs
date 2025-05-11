using AutoMapper;
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
        private readonly IMapper _mapper;

        public CategoryController(ICategoryService categoryService, IMapper mapper)
        {
            _categoryService = categoryService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllCategoriesAsync();
            if (!result.IsValid)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(byte id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            if (!result.IsValid)
            {
                return NotFound(result);
            }
            return Ok(result);
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
                return BadRequest(createResult);
            }

            return StatusCode(201, createResult);
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
                return BadRequest(updateResult);
            }

            return Ok(updateResult);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(byte id)
        {
            var result = await _categoryService.DeleteCategory(id);
            if (!result.IsValid)
            {
                return NotFound(result);
            }

            return Ok(new ValidationResult<object>(null, true, "Category deleted successfully"));
        }
    }
}
