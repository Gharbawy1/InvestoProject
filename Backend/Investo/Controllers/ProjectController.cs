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

        // GET api/projects
        ///<summary>
        /// Retrieves all projects cards
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _projectService.GetAllProjects();
            return Ok(projects);
        }

        ///<summary>
        /// Get Only project details without and additional data, for admin only 
        /// </summary>
        // GET api/project/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var project = await _projectService.GetProjectById(id);
            if (project == null)
                return NotFound("Project not found");

            return Ok(project);
        }

        [HttpGet("get-projects-by-category/{CategoryId}")]
        public async Task<IActionResult> GetProjectsByCategory([FromRoute] byte CategoryId)
        {
            var project = await _projectService.GetProjectsByCategoryAsync(CategoryId);
            if (project == null)
                return NotFound("Project not found");

            return Ok(project);
        }

        ///<summary>
        /// Create new project with default status "Pending" for only BusinessOwners
        /// </summary>
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
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            } 

        }

        ///<summary>
        /// Update project details "only details" without status , for only BusinessOwners
        /// </summary>
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

        ///<summary>
        /// Get Project Details with its business owner details also , for only admin 
        /// </summary>
        // GET: api/project/review/{projectId}
        [HttpGet("review/{projectId}")]
        public async Task<IActionResult> GetProjectRequestForReview([FromRoute]int projectId) // for admin
        {
            var project = await _projectService.GetProjectReviewDtoByIdAsync(projectId);
            if (project == null)
                return NotFound($"Project with Project Id : {projectId} is not found");

            return Ok(project);
        }

        ///<summary>
        /// Update only project status give projectId,Status that you need to change project status to , for admin only 
        /// </summary>
        // PUT: api/project/review/status
        [HttpPut("review/status")]
        public async Task<IActionResult> UpdateProjectStatus([FromBody] ProjectStatusUpdateDto projectStatusUpdateReqDto)// for admin
        {
            var result = await _projectService.UpdateProjectStatusAsync(projectStatusUpdateReqDto);

            if (!result)
                return NotFound($"Project with Project Id : {projectStatusUpdateReqDto.ProjectId} is not found"); // or BadRequest if invalid state

            return Ok($"Project Status Updated Successfully to {projectStatusUpdateReqDto.Status}");
        }

        ///<summary>
        /// Get the project status related to specific business owner, for admin,business owners only 
        /// </summary>
        // GET: api/project/status/owner/{ownerId}
        [HttpGet("status/owner/{ownerId}")]
        public async Task<IActionResult> GetProjectStatus([FromRoute]string ownerId)// for both admin and BO
        {
            var statusDto = await _projectService.GetProjectStatusByOwnerIdAsync(ownerId);
            if (statusDto == null)
                return NotFound($"Project with Owner Id : {ownerId} is not found");

            return Ok(statusDto);
        }


        ///<summary>
        /// Retrieves all project requests based on the provided status (Pending, Accepted, Rejected) for admins only.
        ///// </summary>
        //[HttpGet("GetProjectRequestsByStatus")]
        //public async Task<IActionResult> GetProjectRequestsByStatus([FromQuery] string status)
        //{
        //    try
        //    {
        //        // نحوّل الـ string لـ ProjectStatus
        //        if (!Enum.TryParse<ProjectStatus>(status, true, out var projectStatus))
        //        {
        //            return BadRequest("الـ Status غلط! لازم يكون Pending, Accepted, أو Rejected.");
        //        }

        //        var requests = await _projectService.GetProjectRequestsByStatusAsync(projectStatus);
        //        if (requests == null || !requests.Any())
        //        {
        //            return NotFound($"مفيش طلبات مشاريع بالـ Status ده: {status}");
        //        }

        //        return Ok(requests);
        //    }
        //    catch (Exception ex)
        //    {
        //        var errorDetails = ex.InnerException?.Message ?? ex.Message;
        //        var errorMessages = new List<string>
        //{
        //    "فيه مشكلة وإحنا بنحاول نجيب طلبات المشاريع",
        //    $"الرسالة: {errorDetails}"
        //};
        //        return StatusCode((int)HttpStatusCode.InternalServerError, errorMessages);
        //    }
        //}
       
    }
}
