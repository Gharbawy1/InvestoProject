using Investo.Entities.DTO.Project;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Investo.DataAccess.Services.Image_Loading;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata.Ecma335;

namespace Investo.DataAccess.Services.Project
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IImageLoadService _imageLoadService;

        public ProjectService(IProjectRepository projectRepository, IImageLoadService imageLoadService)
        {
            _projectRepository = projectRepository;
            _imageLoadService = imageLoadService;
        }

        public async Task CreateProject(ProjectCreateUpdateDto dto)
        {
            string imageUrl = null;

            if (dto.ProjectImage != null && dto.ProjectImage.Length > 0)
            {
                imageUrl = await _imageLoadService.Upload(dto.ProjectImage);
            }

            var project = new Entities.Models.Project
            {
                ProjectTitle = dto.ProjectTitle,
                Subtitle = dto.Subtitle,
                ProjectLocation = dto.ProjectLocation,
                ProjectImageURL = imageUrl,
                FundingGoal = dto.FundingGoal,
                FundingExchange = dto.FundingExchange,
                //Status = dto.Status,
                ProjectVision = dto.ProjectVision,
                ProjectStory = dto.ProjectStory,
                CurrentVision = dto.CurrentVision,
                Goals = dto.Goals,
                CategoryId = dto.CategoryId,
                OwnerId = dto.OwnerId
            };

            await _projectRepository.Create(project);
        }

        public async Task UpdateProject(int id, ProjectCreateUpdateDto dto)
        {
            var project = await _projectRepository.GetById(id);
            if (project == null)
                throw new Exception("Project not found");

            if (dto.ProjectImage != null && dto.ProjectImage.Length > 0)
            {
                project.ProjectImageURL = await _imageLoadService.Upload(dto.ProjectImage);
            }

            project.ProjectTitle = dto.ProjectTitle;
            project.Subtitle = dto.Subtitle;
            project.ProjectLocation = dto.ProjectLocation;
            project.FundingGoal = dto.FundingGoal;
            project.FundingExchange = dto.FundingExchange;
            //project.Status = dto.Status;
            project.ProjectVision = dto.ProjectVision;
            project.ProjectStory = dto.ProjectStory;
            project.CurrentVision = dto.CurrentVision;
            project.Goals = dto.Goals;
            project.CategoryId = dto.CategoryId;
            project.OwnerId = dto.OwnerId;

            await _projectRepository.Update(project);
        }

        public async Task<bool> DeleteProject(int id)
        {
            var existingProject = await _projectRepository.GetById(id);
            if (existingProject == null) return false;

            _projectRepository.Delete(existingProject);
            return true;
        }

        public async Task<IEnumerable<ProjectReadDto>> GetAllProjects()
        {
            var projects = await _projectRepository.GetAll();
            return projects.Select(p => new ProjectReadDto
            {
                Id = p.Id,
                ProjectTitle = p.ProjectTitle,
                Subtitle = p.Subtitle,
                ProjectLocation = p.ProjectLocation,
                ProjectImageUrl = p.ProjectImageURL,
                FundingGoal = p.FundingGoal,
                FundingExchange = p.FundingExchange,
                Status = p.Status,
                ProjectVision = p.ProjectVision,
                ProjectStory = p.ProjectStory,
                CurrentVision = p.CurrentVision,
                Goals = p.Goals,
                CategoryId = p.CategoryId,
                OwnerId = p.OwnerId
            });
        }

        public async Task<ProjectReadDto> GetProjectById(int id)
        {
            var project = await _projectRepository.GetById(id);
            if (project == null) return null;

            return new ProjectReadDto
            {
                Id = project.Id,
                ProjectTitle = project.ProjectTitle,
                Subtitle = project.Subtitle,
                ProjectLocation = project.ProjectLocation,
                ProjectImageUrl = project.ProjectImageURL,
                FundingGoal = project.FundingGoal,
                FundingExchange = project.FundingExchange,
                Status = project.Status,
                ProjectVision = project.ProjectVision,
                ProjectStory = project.ProjectStory,
                CurrentVision = project.CurrentVision,
                Goals = project.Goals,
                CategoryId = project.CategoryId,
                OwnerId = project.OwnerId
            };
        }

        public async Task<ProjectRequestReviewDto> GetProjectReviewDtoByIdAsync(int id)
        {
            var project = await _projectRepository.GetById(id);
            if (project == null || project.Owner == null || project.Owner.PersonInfo == null)
                return null;

            var owner = project.Owner;

            return new ProjectRequestReviewDto
            {
                // Project properties
                Id = project.Id,
                ProjectTitle = project.ProjectTitle,
                Subtitle = project.Subtitle,
                ProjectLocation = project.ProjectLocation,
                ProjectImageURL = project.ProjectImageURL,
                FundingGoal = project.FundingGoal,
                FundingExchange = project.FundingExchange,
                ProjectVision = project.ProjectVision,
                ProjectStory = project.ProjectStory,
                CurrentVision = project.CurrentVision,
                Goals = project.Goals,
                CategoryId = project.CategoryId,
                OwnerId = project.OwnerId,
                Status = project.Status,
                FullName = owner.FirstName +" "+owner.LastName,
                // Business owner info
                Bio = owner.Bio,
                RegistrationDate = owner.RegistrationDate,
                
                Email = owner.Email,
                PhoneNumber = owner.PhoneNumber,
                ProfilePictureURL = owner.ProfilePictureURL,
                Address = owner.Address
            };
        }

        public async Task<bool> UpdateProjectStatusAsync(ProjectStatusUpdateDto newProjectUpdateStateReq)
        {
            var project = await _projectRepository.GetById(newProjectUpdateStateReq.ProjectId);
            if (project == null)
                return false;

            project.Status = newProjectUpdateStateReq.Status;
            await _projectRepository.Update(project);
            return true;
        }

        public async Task<ProjectStatusUpdateDto> GetProjectStatusByOwnerIdAsync(string ownerId)
        {
            var project = await _projectRepository.GetByOwnerIdAsync(ownerId);
            if (project == null) return null;

            return new ProjectStatusUpdateDto
            {
                ProjectId = project.Id,
                Status = project.Status
            };
          
        }
    }
}
