using Microsoft.AspNetCore.Mvc;
namespace Investo.Presentation.Controllers
{
    public class ProjectController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<ProjectDto>> GetAll([FromQuery] ProjectDto dto)
        {
            return Ok(new List<ProjectDto>());
        }

    }
}
