using System.Linq;
using Application.Products;
using AutoMapper;
using Domain;

namespace Application.ProductComments
{
    public class MappingProfile : Profile
    {
           public MappingProfile()
        {
            CreateMap<ProductComment, ProductCommentsDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
                // .ForMember(d => d.Following, o => o.MapFrom<FollowingResolver>());
        }      
    }
}