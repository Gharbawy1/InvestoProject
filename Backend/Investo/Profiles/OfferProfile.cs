using AutoMapper;
using Investo.Entities.DTO.Category;
using Investo.Entities.DTO.Offer;
using Investo.Entities.Models;

namespace Investo.Presentation.Profiles
{
    public class OfferProfile:Profile
    {
        public OfferProfile()
        {
            CreateMap<Offer, ReadOfferDto>()
                .ForMember(dest=>dest.ProjectId,opt=>opt.MapFrom(src=>src.Project.Id))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.InvestmentType, opt => opt.MapFrom(src => src.InvestmentType.ToString()))
                .ForMember(dest => dest.Investor, opt => opt.MapFrom(src => src.Investor))
                .ForMember(dest => dest.OfferId, opt => opt.MapFrom(src => src.Id));

            
            CreateMap<CreateOrUpdateOfferDto, Offer>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => OfferStatus.Pending))
                .ForMember(dest => dest.OfferDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.ExpirationDate, opt => opt.MapFrom(src => DateTime.UtcNow.AddDays(30)));

            CreateMap<Investor, InvestorBasicInfoDto>();

        }
    }
}