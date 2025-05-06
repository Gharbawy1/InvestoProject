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
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace Investo.DataAccess.Services.Project
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IImageLoadService _imageLoadService;
        private readonly IBusinessOwnerRepository _businessOwnerRepository;
        private readonly IOfferService _offerService;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        public ProjectService(IProjectRepository projectRepository, IImageLoadService imageLoadService, IBusinessOwnerRepository businessOwnerRepository, IOfferService offerService, IMapper mapper, UserManager<ApplicationUser> userManager, IOfferRepository offerRepository)
        {
            _projectRepository = projectRepository;
            _imageLoadService = imageLoadService;
            _businessOwnerRepository = businessOwnerRepository;
            _offerService = offerService;
            this._mapper = mapper;
            _userManager = userManager;
        }

        public async Task<ValidationResult<ProjectReadDto>> CreateProject(ProjectCreateUpdateDto dto)
        {
            string imageUrl = null;
            string articlesUrl = null;
            string registryUrl = null;
            string textCardUrl = null;

            if (dto.ProjectImage != null && dto.ProjectImage.Length > 0)
            {
                imageUrl = await _imageLoadService.Upload(dto.ProjectImage);
            }


            var ownerExists = await _businessOwnerRepository.ExistsAsync(dto.OwnerId);
            if (!ownerExists) return new ValidationResult<ProjectReadDto>
            {
                Data = new ProjectReadDto(),
                ErrorMessage = "Business owner with given ID does not exist.",
                IsValid = false
            };

            if (dto.ArticlesOfAssociation != null && dto.ArticlesOfAssociation.Length > 0)
            {
                articlesUrl = await _imageLoadService.Upload(dto.ArticlesOfAssociation);
            }

            if (dto.CommercialRegistryCertificate != null && dto.CommercialRegistryCertificate.Length > 0)
            {
                registryUrl = await _imageLoadService.Upload(dto.CommercialRegistryCertificate);
            }

            if (dto.TextCard != null && dto.TextCard.Length > 0)
            {
                textCardUrl = await _imageLoadService.Upload(dto.TextCard);
            } 



            var hasProject = await _projectRepository.HasProjectForOwner(dto.OwnerId);
            if (hasProject) return new ValidationResult<ProjectReadDto>
            {
                Data = new ProjectReadDto(),
                ErrorMessage = "a business owner can only have one project",
                IsValid = false
            };

            var project =_mapper.Map<Entities.Models.Project>(dto);
            project.ProjectImageURL = imageUrl;
            project.ArticlesOfAssociationUrl = articlesUrl;
            project.CommercialRegistryCertificateUrl = registryUrl;
            project.TextCardUrl = textCardUrl;


            await _projectRepository.Create(project);

            var createdProject = await _projectRepository.GetById(project.Id);

            var mappedProject = _mapper.Map<ProjectReadDto>(createdProject);

            return new ValidationResult<ProjectReadDto>
            {
                Data = mappedProject,
                ErrorMessage = null,
                IsValid = true
            };

        }  // auto mapper Done

        public async Task<ValidationResult<ProjectReadDto>> UpdateProject(int id, ProjectCreateUpdateDto dto)
        {
            var project = await _projectRepository.GetById(id);
            if (project == null) return new ValidationResult<ProjectReadDto>
            {
                Data = new ProjectReadDto(),
                ErrorMessage = $"Project with given Id : {id} is not found",
                IsValid = false
            };

            var ownerExists = await _businessOwnerRepository.ExistsAsync(dto.OwnerId);
            if (!ownerExists) return new ValidationResult<ProjectReadDto>
            {
                Data = new ProjectReadDto(),
                ErrorMessage = $"Business owner with given ID does not exist.",
                IsValid = false
            };

            if (dto.ProjectImage != null && dto.ProjectImage.Length > 0)
            {
                project.ProjectImageURL = await _imageLoadService.Upload(dto.ProjectImage);
            }

            _mapper.Map(dto, project);// src,dest

            await _projectRepository.Update(project);

            var MappedprojectReadDto = _mapper.Map<ProjectReadDto>(project);

            return new ValidationResult<ProjectReadDto>
            {
                Data = MappedprojectReadDto,
                ErrorMessage = null,
                IsValid = true
            };

        } // auto mapper Done

        public async Task<bool> DeleteProject(int id)
        {
            var existingProject = await _projectRepository.GetById(id);
            if (existingProject == null) return false;

            _projectRepository.Delete(existingProject);
            return true;
        }

        public async Task<ValidationResult<IEnumerable<ProjectCardDetailsDto>>> GetAllProjects()
        {
            var projects = await _projectRepository.GetAll();
            var projectCardList = new List<ProjectCardDetailsDto>();

            foreach (var project in projects)
            {
                var projectCard = _mapper.Map<ProjectCardDetailsDto>(project);
                // Use MaxOfferAmount directly instead of calculating from Offers table
                projectCard.raisedFunds = project.RaisedFund;
                projectCardList.Add(projectCard);
            }
            return new ValidationResult<IEnumerable<ProjectCardDetailsDto>>
            {
                Data = projectCardList,
                ErrorMessage = null,
                IsValid = true
            };
        }
        // auto mapper Done

        public async Task<ValidationResult<ProjectReadDto>> GetProjectById(int id)
        {
            var project = await _projectRepository.GetById(id);
            if (project == null)
            {
                return new ValidationResult<ProjectReadDto>
                {
                    Data = null,
                    ErrorMessage = $"Project with ID {id} not found.",
                    IsValid = false
                };
            }

            var mappedProjectReadDto = _mapper.Map<ProjectReadDto>(project);


            var mappedProjectReadDto = _mapper.Map<ProjectReadDto>(project);
            mappedProjectReadDto.InvestorsCount = await _projectRepository.GetInvestorsCountByProjectIdAsync(id);

            return new ValidationResult<ProjectReadDto>
            {
                Data = mappedProjectReadDto,
                ErrorMessage = null,
                IsValid = true
            };
        }
        // auto mapper Done

        public async Task<ValidationResult<ProjectRequestReviewDto>> GetProjectReviewDtoByIdAsync(int id)
        {
            var project = await _projectRepository.GetById(id);
            if (project == null || project.Owner == null || project.Owner.PersonInfo == null)
                return null;

            var owner = project.Owner;
            var MappedProject = _mapper.Map<ProjectRequestReviewDto>(project);
            return new ValidationResult<ProjectRequestReviewDto>
            {
                Data = MappedProject,
                ErrorMessage = null,
                IsValid = true

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

        public async Task<ValidationResult<ProjectStatusUpdateDto>> GetProjectStatusByOwnerIdAsync(string ownerId)
        {
            var project = await _projectRepository.GetByOwnerIdAsync(ownerId);
            if (project == null) return null;

            return new ValidationResult<ProjectStatusUpdateDto>
            {
                Data = new ProjectStatusUpdateDto
                {
                    ProjectId = project.Id,
                    Status = project.Status.ToString()
                },
                ErrorMessage = null,
                IsValid = true
            };
        }



        public async Task<ValidationResult<List<ProjectReadDto>>> GetProjectsByCategoryAsync(byte categoryId)
        {
            var projectsAssociatedWithCategory = await _projectRepository.GetProjectsByCategory(categoryId);

            if (projectsAssociatedWithCategory == null || !projectsAssociatedWithCategory.Any())
            {
                return new ValidationResult<List<ProjectReadDto>>
                {
                    Data = new List<ProjectReadDto>(),
                    ErrorMessage = $"No projects found for the given category ID: {categoryId}.",
                    IsValid = false
                };
            }

            var mappedProjects = _mapper.Map<List<ProjectReadDto>>(projectsAssociatedWithCategory);

            return new ValidationResult<List<ProjectReadDto>>
            {
                Data = mappedProjects,
                ErrorMessage = null,
                IsValid = true
            };
        }

        public async Task<ValidationResult<IEnumerable<ProjectRequestReviewDto>>> GetProjectRequestsByStatusAsync(ProjectStatus status)
        {
            var requests = await _projectRepository.GetProjectRequestsByStatusAsync(status);
            var mappedRequests = _mapper.Map<IEnumerable<ProjectRequestReviewDto>>(requests);

            return new ValidationResult<IEnumerable<ProjectRequestReviewDto>>
            {
                Data = mappedRequests,
                IsValid = true,
                ErrorMessage = null
            };
        }

        public async Task<ValidationResult<ProjectReadDto>> GetProjectForCurrentBusinessOwnerAsync(string businessOwnerId)
        {
            var project = await _projectRepository.GetByOwnerIdAsync(businessOwnerId);
            if (project == null)
            {
                return new ValidationResult<ProjectReadDto>
                {
                    Data=null,
                    IsValid = false,
                    ErrorMessage = "مفيش مشروع مرتبط بالمستخدم ده"
                };
            }
            var raisedFunds = await _offerService.GetProjectsRaisedFundsAsync();
            var raisedFund = raisedFunds.FirstOrDefault(rf => rf.ProjectId == project.Id)?.RaisedFund ?? 0;
            
            var mappedProject = new ProjectReadDto
            {
                CategoryName = project.Category.Name,
                CurrentVision = project.CurrentVision,
                FundingExchange = project.FundingExchange,
                FundingGoal = project.FundingGoal,
                Goals = project.Goals,
                Id = project.Id,
                OwnerId = project.OwnerId,
                OwnerName = project.Owner.FirstName+" "+project.Owner.LastName,
                ProjectImageUrl = project.ProjectImageURL,
                ProjectStory = project.ProjectStory,
                ProjectTitle = project.ProjectTitle,
                ProjectVision = project.ProjectVision,
                Status = project.Status.ToString(),
                ProjectLocation = project.ProjectLocation,
                Subtitle= project.Subtitle,
                RaisedFund = raisedFund,
                InvestorsCount = await _projectRepository.GetInvestorsCountByProjectIdAsync(project.Id)

            };

            return new ValidationResult<ProjectReadDto>
            {
                Data = mappedProject,
                IsValid = true,
                ErrorMessage = null
            };
        }

        public async Task<ValidationResult<int>> GetInvestorsCountByProjectIdAsync(int projectId)
        {
            var project = await _projectRepository.GetById(projectId);
            if (project == null)
            {
                return new ValidationResult<int>
                {
                    Data = 0,
                    IsValid = false,
                    ErrorMessage = $"Project with ID: {projectId} not found."
                };
            }

            var count = await _projectRepository.GetInvestorsCountByProjectIdAsync(projectId);

            if (count == 0)
            {
                return new ValidationResult<int>
                {
                    Data = 0,
                    IsValid = false,
                    ErrorMessage = $"No investors found for project ID: {projectId}"
                };
            }

            return new ValidationResult<int>
            {
                Data = count,
                IsValid = true,
                ErrorMessage = null
            };
        }

        public async Task<ValidationResult<ProjecetDocumentsDto>> GetProjectDocuments(int projectId)
        {
            var project = await _projectRepository.GetById(projectId);

            if (project == null)
            {
                return new ValidationResult<ProjecetDocumentsDto>
                {
                    IsValid = false,
                    ErrorMessage = "Project not found",
                    Data = null
                };
            }

            var documentsDto = new ProjecetDocumentsDto
            {
                ArticlesOfAssociationUrl = project.ArticlesOfAssociationUrl,
                CommercialRegistryCertificateUrl = project.CommercialRegistryCertificateUrl,
                TextCardUrl = project.TextCardUrl
            };

            return new ValidationResult<ProjecetDocumentsDto>
            {
                IsValid = true,
                Data = documentsDto
            };
        }

    }
}
