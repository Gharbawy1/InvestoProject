using Investo.DataAccess.Services.Project;
using Investo.Entities.DTO.Project;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Investo.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        private new List<string> _allowedExtenstions = new List<string> { ".jpg", ".png","jpeg" };
        private long _maxAllowedImageSize = 3 * 1048576;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
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
        public async Task<IActionResult> GetById(int id)
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

            await _projectService.CreateProject(dto);
            return Ok("Project created successfully");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProjectCreateUpdateDto dto)
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
                return Ok("Project updated successfully");
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // DELETE: api/project/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) 
        {
            await _projectService.DeleteProject(id);
            return Ok("Project deleted successfully");
        }
    }
}
