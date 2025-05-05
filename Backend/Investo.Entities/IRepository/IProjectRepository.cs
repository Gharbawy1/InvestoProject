using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Investo.Entities.DTO.Project;
using Investo.Entities.Models;

namespace Investo.Entities.IRepository
{
    public interface IProjectRepository
    {
        Task<IEnumerable<Project>> GetAll();
        Task<Project> GetById(int id);
        Task Create(Project project);
        Task Update(Project project);
        Task Delete(Project project);
        Task<Project> GetByOwnerIdAsync(string ownerId);
        Task<List<Project>> GetProjectsByCategory(byte CategoryId);
        Task<IEnumerable<Project>> GetProjectRequestsByStatusAsync(ProjectStatus status);

        //Task<IEnumerable<Project>> GetPendingProjectRequestsAsync();
        //Task<IEnumerable<Project>> GetAcceptedProjectRequestsAsync();
        //Task<IEnumerable<Project>> GetRejectedProjectRequestsAsync();
        Task<bool> HasProjectForOwner(string ownerId);
        // IProjectRepository.cs
        Task<int> GetInvestorsCountByProjectIdAsync(int projectId);
      
        


    }
}
