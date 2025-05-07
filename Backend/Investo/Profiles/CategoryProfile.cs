using AutoMapper;
using Investo.Entities.DTO.Category;
using Investo.Entities.Models;

namespace Investo.Presentation.Profiles
{
    public class CategoryProfile:Profile
    {
        public CategoryProfile()
        {
            CreateMap<Category, CategoryDTO>();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

        }
    }
}
