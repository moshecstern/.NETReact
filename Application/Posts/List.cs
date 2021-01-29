using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class List
    {
       public class PostsEnvelope
        {
            public List<PostDto> Posts { get; set; }
            public int PostCount { get; set; }
        }
        public class Query : IRequest<PostsEnvelope>
        {
            public Query(int? limit, int? offset, bool isLiked, bool isHost, DateTime? startDate, string mycat)
            {
                Limit = limit;
                Offset = offset;
                IsLiked = isLiked;
                IsHost = isHost;
                MyCat = mycat;
                StartDate = startDate ?? DateTime.Now;
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsLiked { get; set; }
            public bool IsHost { get; set; }
            public string MyCat { get; set; }
            public DateTime? StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, PostsEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<PostsEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                // var queryable = _context.Posts
                //     .Where(x => x.Date >= request.StartDate)
                //     .OrderBy(x => x.Date)
                //     .AsQueryable();

                // if(request.MyCat.Length < 1)
                // {
                //     var queryable = _context.Posts
                //     .Where(x => x.Date >= request.StartDate && x.Category == request.MyCat)
                //     .OrderBy(x => x.Date)
                //     .AsQueryable();
                // }
 var queryable = _context.Posts
                    .Where(x => x.Date >= request.StartDate && x.Category == request.MyCat)
                    .OrderBy(x => x.Date)
                    .AsQueryable();
               
                
                // var queryCats = _context.Posts
                //     .Where(x => x.Category == request.MyCat)
                //     .OrderBy(x=> x.Date)
                //     .AsQueryable();

                if (request.IsLiked && !request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserPosts.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }

                if (request.IsHost && !request.IsLiked)
                {
                    queryable = queryable.Where(x => x.UserPosts.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost));
                }
                // if (request.MyCat.Length < 2)
                // {
                //     queryable = queryable.Where(x => x.UserPosts.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                // }
        


                var posts = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 3).ToListAsync();

                return new PostsEnvelope
                {
                    Posts = _mapper.Map<List<Post>, List<PostDto>>(posts),
                    PostCount = queryable.Count()
                };
            }
        } 
    }
}