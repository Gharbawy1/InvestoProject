using Investo.DataAccess.Services.Interfaces;
using Investo.DataAccess.Services.Project;
using Investo.Entities.DTO.Project;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;

namespace Investo.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ICategoryService _categoryService;

        private new List<string> _allowedExtenstions = new List<string> { ".jpg", ".png","jpeg" };
        private long _maxAllowedImageSize = 3 * 1048576;

        public ProjectController(IProjectService projectService,ICategoryService categoryService)
        {
            _projectService = projectService;
            _categoryService = categoryService;
        }

        // GET: api/project
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _projectService.GetAllProjects();
            return Ok(projects);
        }

        // GET: api/project/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var project = await _projectService.GetProjectById(id);
            if (project == null)
                return NotFound("Project not found");

            return Ok(project);
        }

        // POST: api/project
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProjectCreateUpdateDto dto)
        {
            if (dto.ProjectImage == null)
                return BadRequest("Project image is required!");

            var extension = Path.GetExtension(dto.ProjectImage.FileName).ToLower();
            if (!_allowedExtenstions.Contains(extension))
                return BadRequest("Only .png, .jpg, and .jpeg images are allowed!");

            if (dto.ProjectImage.Length > _maxAllowedImageSize)
                return BadRequest("Max allowed size for the image is 1MB!");

            var IsValidCategory = await _categoryService.IsValidCategory(dto.CategoryId);
            if (!IsValidCategory) return BadRequest("Invalid Category Id");

            // when Business owner logic,sevices and repositories are added I will add validation for them 

            await _projectService.CreateProject(dto);
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromForm] ProjectCreateUpdateDto dto)
        {
            try
            {
                if (dto.ProjectImage != null)
                {
                    var extension = Path.GetExtension(dto.ProjectImage.FileName).ToLower();
                    if (!_allowedExtenstions.Contains(extension))
                        return BadRequest("Only .png, .jpg, and .jpeg images are allowed!");

                    if (dto.ProjectImage.Length > _maxAllowedImageSize)
                        return BadRequest("Max allowed size for the image is 1MB!");
                }

                await _projectService.UpdateProject(id, dto);
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // DELETE: api/project/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject ([FromRoute] int id)
        {
            try
            {
                var deleted = await _projectService.DeleteProject(id);
                if (!deleted)
                    return NotFound($"The Project with Id : {id} is not found");

                return Ok("Project Deleted Successfully");
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

        }
    }
}
