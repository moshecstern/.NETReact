using System.Linq;
using AutoMapper;
using Domain;

namespace Application.MessageComments
{
    public class MappingProfile : Profile
    {
       public MappingProfile()
        {
            CreateMap<MessageComment, MessageCommentsDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
                // .ForMember(d => d.Following, o => o.MapFrom<FollowingResolver>());
        }         
    }
}