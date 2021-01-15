using System.Linq;
using AutoMapper;
using Domain;

namespace Application.BlogComments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<BlogComment, BlogCommentsDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
                // .ForMember(d => d., o => o.MapFrom<FollowingResolver>());
        }        
    }
}