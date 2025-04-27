using Investo.Entities.DTO.Project;
using Investo.Entities.IRepository;
using Investo.Entities.Models;
using Investo.DataAccess.Services.Image_Loading;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata.Ecma335;
using Microsoft.EntityFrameworkCore;
using Microsoft.CodeAnalysis;
using Investo.DataAccess.Repository;
using Investo.DataAccess.Services.Offers;

namespace Investo.DataAccess.Services.Project
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IImageLoadService _imageLoadService;
        private readonly IBusinessOwnerRepository _businessOwnerRepository;
        private readonly IOfferService _offerService;

        public ProjectService(IProjectRepository projectRepository, IImageLoadService imageLoadService, IBusinessOwnerRepository businessOwnerRepository, IOfferService offerService)
        {
            _projectRepository = projectRepository;
            _imageLoadService = imageLoadService;
            _businessOwnerRepository = businessOwnerRepository;
            _offerService = offerService;
        }

        public async Task<ProjectReadDto> CreateProject(ProjectCreateUpdateDto dto)
        {
            string imageUrl = null;

            if (dto.ProjectImage != null && dto.ProjectImage.Length > 0)
            {
                imageUrl = await _imageLoadService.Upload(dto.ProjectImage);
            }

            var hasProject = await _projectRepository.HasProjectForOwner(dto.OwnerId);
            if (hasProject)
                throw new InvalidOperationException("A business owner can only have one project.");

            var ownerExists = await _businessOwnerRepository.ExistsAsync(dto.OwnerId);
            if (!ownerExists)
                throw new KeyNotFoundException("Business owner with given ID does not exist.");



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
            return new ProjectReadDto
            {
                Id = project.Id,
                ProjectTitle = project.ProjectTitle,
                Subtitle = project.Subtitle,
                ProjectLocation = project.ProjectLocation,
                ProjectImageUrl = project.ProjectImageURL,
                FundingGoal = project.FundingGoal,
                FundingExchange = project.FundingExchange,
                Status = project.Status.ToString(),
                ProjectVision = project.ProjectVision,
                ProjectStory = project.ProjectStory,
                CurrentVision = project.CurrentVision,
                Goals = project.Goals,
                OwnerId = project.OwnerId,
                CategoryName = project.Category.Name
            };
        }

        public async Task<ProjectReadDto> UpdateProject(int id, ProjectCreateUpdateDto dto)
        {
            var project = await _projectRepository.GetById(id);
            if (project == null)
                throw new Exception("Project not found");

            var ownerExists = await _businessOwnerRepository.ExistsAsync(dto.OwnerId);
            if (!ownerExists)
                throw new KeyNotFoundException("Business owner with given ID does not exist.");

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
            return new ProjectReadDto
            {
                Id = project.Id,
                ProjectTitle = project.ProjectTitle,
                Subtitle = project.Subtitle,
                ProjectLocation = project.ProjectLocation,
                ProjectImageUrl = project.ProjectImageURL,
                FundingGoal = project.FundingGoal,
                FundingExchange = project.FundingExchange,
                Status = project.Status.ToString(),
                ProjectVision = project.ProjectVision,
                ProjectStory = project.ProjectStory,
                CurrentVision = project.CurrentVision,
                Goals = project.Goals,
                OwnerId = project.OwnerId,
                CategoryName = project.Category.Name
            };

        }

        public async Task<bool> DeleteProject(int id)
        {
            var existingProject = await _projectRepository.GetById(id);
            if (existingProject == null) return false;

            _projectRepository.Delete(existingProject);
            return true;
        }

        public async Task<IEnumerable<ProjectCardDetailsDto>> GetAllProjects()
        {
            var projects = await _projectRepository.GetAll();
            var raisedFunds = await _offerService.GetProjectsRaisedFundsAsync();


            return projects.Select(p =>
            {
                var raisedFund = raisedFunds.FirstOrDefault(rf => rf.ProjectId == p.Id)?.RaisedFund ?? 0;

                return new ProjectCardDetailsDto
                {
                    Id = p.Id,
                    ProjectTitle = p.ProjectTitle,
                    Subtitle = p.Subtitle,
                    ProjectImageUrl = p.ProjectImageURL,
                    FundingGoal = p.FundingGoal,
                    CategoryName = p.Category.Name,
                    OwnerName = p.Owner.FirstName + " " + p.Owner.LastName,
                    raisedFunds = raisedFund
                };
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
                Status = (project.Status).ToString(),
                ProjectVision = project.ProjectVision,
                ProjectStory = project.ProjectStory,
                CurrentVision = project.CurrentVision,
                Goals = project.Goals,
                CategoryName = project.Category.Name,
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
                CategoryName = project.Category.Name,
                OwnerId = project.OwnerId,
                Status = (project.Status).ToString(),

                // Owner info
                FirstName = owner.FirstName,
                LastName = owner.LastName,
                Bio = owner.Bio,
                RegistrationDate = owner.RegistrationDate,
                Email = owner.Email,
                PhoneNumber = owner.PhoneNumber,
                ProfilePictureURL = owner.ProfilePictureURL,
                Address = owner.Address,
                NationalID = owner?.PersonInfo?.NationalID,
                NationalIDImageFrontURL = owner?.PersonInfo?.NationalIDImageFrontURL,
                NationalIDImageBackURL = owner?.PersonInfo?.NationalIDImageBackURL
            };
        }

        public async Task<bool> UpdateProjectStatusAsync(ProjectStatusUpdateDto newProjectUpdateStateReq)
        {
            var project = await _projectRepository.GetById(newProjectUpdateStateReq.ProjectId);
            if (project == null)
                return false;

            if (!Enum.TryParse<ProjectStatus>(newProjectUpdateStateReq.Status, true, out var parsedStatus))
                throw new InvalidOperationException("Invalid project status value.");

            project.Status = parsedStatus;
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
                Status = project.Status.ToString()
            };
        }

        public async Task<IEnumerable<ProjectRequestReviewDto>> GetAllPendingProjectRequestsForReviewAsync()
        {
            var requests = await _projectRepository.GetPendingProjectRequestsAsync();
            
            var result = requests.Select(p => new ProjectRequestReviewDto
            {
                // Project
                Id = p.Id,
                ProjectTitle = p.ProjectTitle,
                Subtitle = p.Subtitle,
                ProjectLocation = p.ProjectLocation,
                ProjectImageURL = p.ProjectImageURL,
                FundingGoal = p.FundingGoal,
                FundingExchange = p.FundingExchange,
                ProjectVision = p.ProjectVision,
                ProjectStory = p.ProjectStory,
                CurrentVision = p.CurrentVision,
                Goals = p.Goals,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                OwnerId = p.OwnerId, 
                // Owner
                FirstName = p.Owner?.FirstName,
                LastName = p.Owner?.LastName,
                Bio = p.Owner?.Bio,
                RegistrationDate = p.Owner?.RegistrationDate ?? DateTime.MinValue,
                Email = p.Owner?.Email,
                PhoneNumber = p.Owner?.PhoneNumber,
                ProfilePictureURL = p.Owner?.ProfilePictureURL,
                Address = p.Owner?.Address,
                NationalID = p.Owner?.PersonInfo?.NationalID,
                NationalIDImageFrontURL = p.Owner?.PersonInfo?.NationalIDImageFrontURL,
                NationalIDImageBackURL = p.Owner?.PersonInfo?.NationalIDImageBackURL
            });

            return result;
        }

        public async Task<IEnumerable<ProjectRequestReviewDto>> GetAllAcceptedProjectRequestsAsync()
        {
            var requests = await _projectRepository.GetAcceptedProjectRequestsAsync();

            var result = requests.Select(p => new ProjectRequestReviewDto
            {
                // Project
                Id = p.Id,
                ProjectTitle = p.ProjectTitle,
                Subtitle = p.Subtitle,
                ProjectLocation = p.ProjectLocation,
                ProjectImageURL = p.ProjectImageURL,
                FundingGoal = p.FundingGoal,
                FundingExchange = p.FundingExchange,
                ProjectVision = p.ProjectVision,
                ProjectStory = p.ProjectStory,
                CurrentVision = p.CurrentVision,
                Goals = p.Goals,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                OwnerId = p.OwnerId,
                // Owner
                FirstName = p.Owner?.FirstName,
                LastName = p.Owner?.LastName,
                Bio = p.Owner?.Bio,
                RegistrationDate = p.Owner?.RegistrationDate ?? DateTime.MinValue,
                Email = p.Owner?.Email,
                PhoneNumber = p.Owner?.PhoneNumber,
                ProfilePictureURL = p.Owner?.ProfilePictureURL,
                Address = p.Owner?.Address,
                NationalID = p.Owner?.PersonInfo?.NationalID,
                NationalIDImageFrontURL = p.Owner?.PersonInfo?.NationalIDImageFrontURL,
                NationalIDImageBackURL = p.Owner?.PersonInfo?.NationalIDImageBackURL
            });

            return result;
        }

        public async Task<IEnumerable<ProjectRequestReviewDto>> GetAllRejectedProjectRequestsAsync()
        {
            var requests = await _projectRepository.GetRejectedProjectRequestsAsync();

            var result = requests.Select(p => new ProjectRequestReviewDto
            {
                // Project
                Id = p.Id,
                ProjectTitle = p.ProjectTitle,
                Subtitle = p.Subtitle,
                ProjectLocation = p.ProjectLocation,
                ProjectImageURL = p.ProjectImageURL,
                FundingGoal = p.FundingGoal,
                FundingExchange = p.FundingExchange,
                ProjectVision = p.ProjectVision,
                ProjectStory = p.ProjectStory,
                CurrentVision = p.CurrentVision,
                Goals = p.Goals,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                OwnerId = p.OwnerId,
                // Owner
                FirstName = p.Owner?.FirstName,
                LastName = p.Owner?.LastName,
                Bio = p.Owner?.Bio,
                RegistrationDate = p.Owner?.RegistrationDate ?? DateTime.MinValue,
                Email = p.Owner?.Email,
                PhoneNumber = p.Owner?.PhoneNumber,
                ProfilePictureURL = p.Owner?.ProfilePictureURL,
                Address = p.Owner?.Address,
                NationalID = p.Owner?.PersonInfo?.NationalID,
                NationalIDImageFrontURL = p.Owner?.PersonInfo?.NationalIDImageFrontURL,
                NationalIDImageBackURL = p.Owner?.PersonInfo?.NationalIDImageBackURL
            });

            return result;
        }

        public async Task<List<ProjectReadDto>> GetProjectsByCategoryAsync(byte CategoryId)
        {
            var ReturnedProjects = await _projectRepository.GetProjectsByCategory(CategoryId);
            var ProjectsReadDtos = new List<ProjectReadDto>();
            foreach (var Project in ReturnedProjects)
            {
                var projectDto = new ProjectReadDto
                {
                    Id = Project.Id,
                    ProjectTitle = Project.ProjectTitle,
                    Subtitle = Project.Subtitle,
                    ProjectLocation = Project.ProjectLocation,
                    ProjectImageUrl = Project.ProjectImageURL,
                    FundingGoal = Project.FundingGoal,
                    FundingExchange = Project.FundingExchange,
                    Status = Project.Status.ToString(),
                    ProjectVision = Project.ProjectVision,
                    ProjectStory = Project.ProjectStory,
                    CurrentVision = Project.CurrentVision,
                    Goals = Project.Goals,
                    CategoryName = Project.Category.Name,
                    OwnerId = Project.OwnerId
                };
                ProjectsReadDtos.Add(projectDto);
            }
            return ProjectsReadDtos;
        }
    }
}
