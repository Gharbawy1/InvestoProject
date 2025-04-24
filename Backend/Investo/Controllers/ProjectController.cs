using Investo.DataAccess.Services.Interfaces;
using Investo.DataAccess.Services.Project;
using Investo.Entities.DTO.Project;
using Investo.Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        private new List<string> _allowedExtenstions = new List<string> { ".jpg", ".png",".jpeg" };
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
                return BadRequest("Max allowed size for the image is 3MB!");

            var IsValidCategory = await _categoryService.IsValidCategory(dto.CategoryId);
            if (!IsValidCategory) return BadRequest("Invalid Category Id");

            try
            {
                var createdProject = await _projectService.CreateProject(dto);
                return Ok(createdProject);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT: api/project/{id}
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
                var IsValidCategory = await _categoryService.IsValidCategory(dto.CategoryId);
                if (!IsValidCategory) return BadRequest("Invalid Category Id");


                var UpdatedProject = await _projectService.UpdateProject(id,dto);
                return Ok(UpdatedProject);
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

        // GET: api/project/review/{projectId}
        [HttpGet("review/{projectId}")]
        public async Task<IActionResult> GetProjectRequestForReview([FromRoute]int projectId) // for admin
        {
            var project = await _projectService.GetProjectReviewDtoByIdAsync(projectId);
            if (project == null)
                return NotFound($"Project with Project Id : {projectId} is not found");

            return Ok(project);
        }

        // PUT: api/project/review/status
        [HttpPut("review/status")]
        public async Task<IActionResult> UpdateProjectStatus([FromBody] ProjectStatusUpdateDto projectStatusUpdateReqDto)// for admin
        {
            var result = await _projectService.UpdateProjectStatusAsync(projectStatusUpdateReqDto);

            if (!result)
                return NotFound($"Project with Project Id : {projectStatusUpdateReqDto.ProjectId} is not found"); // or BadRequest if invalid state

            return Ok($"Project Status Updated Successfully to {projectStatusUpdateReqDto.Status}");
        }

        // GET: api/project/status/owner/{ownerId}
        [HttpGet("status/owner/{ownerId}")]
        public async Task<IActionResult> GetProjectStatus([FromRoute]string ownerId)// for both admin and BO
        {
            var statusDto = await _projectService.GetProjectStatusByOwnerIdAsync(ownerId);
            if (statusDto == null)
                return NotFound($"Project with Owner Id : {ownerId} is not found");

            return Ok(statusDto);
        }

        // GET: api/project/review/pending
        [HttpGet("review/pending")]
        public async Task<IActionResult> GetAllPendingProjectRequestsAsync() // for admin
        {
            var requests = await _projectService.GetAllPendingProjectRequestsForReviewAsync();
            if (requests == null || !requests.Any())
                return NotFound("No pending project requests found for review.");

            return Ok(requests);
        }

        // GET: api/project/review/accepted
        [HttpGet("review/accepted")]
        public async Task<IActionResult> GetAllAcceptedProjectRequestsAsync() // for admin
        {
            var requests = await _projectService.GetAllAcceptedProjectRequestsAsync();
            if (requests == null || !requests.Any())
                return NotFound("No accepted project requests found.");

            return Ok(requests);
        }

        // GET: api/project/review/rejected
        [HttpGet("review/rejected")]
        public async Task<IActionResult> GetAllRejectedProjectRequestsAsync() // for admin
        {
            var requests = await _projectService.GetAllRejectedProjectRequestsAsync();
            if (requests == null || !requests.Any())
                return NotFound("No rejected project requests found.");

            return Ok(requests);
        }

    }
}
