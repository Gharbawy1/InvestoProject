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
        Task<Project> GetByCategoryIdAsync(byte CategoryId);



    }
}
