using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Project;
using Investo.Entities.Models;

namespace Investo.DataAccess.Services.Project
{
    public interface IProjectService
    {
        Task<ValidationResult<IEnumerable<ProjectCardDetailsDto>>> GetAllProjects();
        Task<ValidationResult<ProjectReadDto>> GetProjectById(int id);
        Task<ValidationResult<ProjectReadDto>> CreateProject(ProjectCreateUpdateDto dto);
        Task<ValidationResult<ProjectReadDto>> UpdateProject(int id, ProjectCreateUpdateDto dto);
        Task<ValidationResult<List<ProjectReadDto>>> GetProjectsByCategoryAsync(byte CategoryId);
        Task<bool> DeleteProject(int id);
        Task<ValidationResult<ProjectRequestReviewDto>> GetProjectReviewDtoByIdAsync(int id);
        Task<bool> UpdateProjectStatusAsync(ProjectStatusUpdateDto newProjectUpdateStateReq);
        Task<ValidationResult<ProjectStatusUpdateDto>> GetProjectStatusByOwnerIdAsync(string OwnerId);
        Task<ValidationResult<IEnumerable<ProjectRequestReviewDto>>> GetProjectRequestsByStatusAsync(ProjectStatus status);

    }
}
