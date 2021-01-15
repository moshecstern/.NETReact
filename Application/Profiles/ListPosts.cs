using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListPosts
    {
public class Query : IRequest<List<UserPostDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserPostDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserPostDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserPosts
                    .OrderBy(a => a.Post.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.Post.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(a => a.Post.Date >= DateTime.Now);
                        break;
                }

                var experiences = queryable.ToList();
                var experiencesToReturn = new List<UserPostDto>();

                foreach (var post in experiences)
                {
                    var userPost = new UserPostDto
                    {
                        Id = post.Post.Id,
                        Title = post.Post.Title,
                        Category = post.Post.Category,
                        Date = post.Post.Date
                    };

                    experiencesToReturn.Add(userPost);
                }

                return experiencesToReturn;
            }
        }        
        
    }
}