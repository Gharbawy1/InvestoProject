using Investo.DataAccess.Services.Interfaces;
using Investo.Entities.DTO.Category;
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
            var categories = await _categoryService.GetAllCategories();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(byte id)
        {
            var category = await _categoryService.GetCategoryById(id);
            if (category == null) return NotFound($"Category With {id} Not found");
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            await _categoryService.CreateCategory(dto);
            return StatusCode(201,"Category Created Succsessfully");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(byte id, [FromBody] UpdateCategoryDTO dto)
        {
            await _categoryService.UpdateCategory(id, dto);
            return Ok("Category Updated Succsesfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(byte id)
        {
            await _categoryService.DeleteCategory(id);
            return Ok("Category Deleted Succsessfully");
        }
    }
}