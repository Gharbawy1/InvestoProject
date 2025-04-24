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
        Task<IEnumerable<ProjectReadDto>> GetAllProjects();
        Task<ProjectReadDto> GetProjectById(int id);
        Task<ProjectReadDto> CreateProject(ProjectCreateUpdateDto dto);
        Task<ProjectReadDto> UpdateProject(int id, ProjectCreateUpdateDto dto);
        Task<List<ProjectReadDto>> GetProjectsByCategoryAsync(byte CategoryId);
        Task<bool> DeleteProject(int id);
        Task<ProjectRequestReviewDto> GetProjectReviewDtoByIdAsync(int id);
        Task<bool> UpdateProjectStatusAsync(ProjectStatusUpdateDto newProjectUpdateStateReq);
        Task<ProjectStatusUpdateDto> GetProjectStatusByOwnerIdAsync(string OwnerId);
        Task<IEnumerable<ProjectRequestReviewDto>> GetAllPendingProjectRequestsForReviewAsync();
        Task<IEnumerable<ProjectRequestReviewDto>> GetAllAcceptedProjectRequestsAsync();
        Task<IEnumerable<ProjectRequestReviewDto>> GetAllRejectedProjectRequestsAsync();

    }
}
