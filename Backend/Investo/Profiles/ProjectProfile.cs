using AutoMapper;
using Investo.Entities.DTO.Project;
using Investo.Entities.Models;

namespace Investo.Presentation.Profiles
{
    public class ProjectProfile : Profile
    {
        public ProjectProfile()
        {
            CreateMap<Entities.Models.Project, ProjectReadDto>()
                .ForMember(dest => dest.ProjectImageUrl, opt => opt.MapFrom(src => src.ProjectImageURL))
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.FirstName + " " + src.Owner.LastName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<ProjectCreateUpdateDto, Project>()
                .ForMember(dest => dest.ProjectImageURL, opt => opt.Ignore()) // هنسيبها مؤقتًا ونحطها يدوي بعد الماب
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ProjectStatus.Pending)); // مباشرة نعينه Pending

            CreateMap<Entities.Models.Project, ProjectCardDetailsDto>()
                .ForMember(dest => dest.ProjectImageUrl, opt => opt.MapFrom(src => src.ProjectImageURL))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.FirstName + " " + src.Owner.LastName))
                .ForMember(dest => dest.raisedFunds, opt => opt.Ignore()); // raisedFunds دي هتملاها يدوي

            CreateMap<Entities.Models.Project, ProjectCardDetailsDto>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.FirstName + " " + src.Owner.LastName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));



        }

    }

}
