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


            CreateMap<Project, ProjectRequestReviewDto>()
                // Direct mapping for simple properties
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                 .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty))

    // Owner properties
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.FirstName : string.Empty))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.LastName : string.Empty))
                .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.Bio : string.Empty))
                .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.RegistrationDate : DateTime.MinValue))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.Email : string.Empty))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.PhoneNumber : string.Empty))
                .ForMember(dest => dest.ProfilePictureURL, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.ProfilePictureURL : string.Empty))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.Address : string.Empty))

    // Owner's PersonInfo extra properties
                .ForMember(dest => dest.NationalID, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.PersonInfo.NationalID : string.Empty))
                .ForMember(dest => dest.NationalIDImageFrontURL, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.PersonInfo.NationalIDImageFrontURL : null))
                .ForMember(dest => dest.NationalIDImageBackURL, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.PersonInfo.NationalIDImageBackURL : null));


        }

    }

}
