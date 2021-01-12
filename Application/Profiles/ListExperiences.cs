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
    public class ListExperiences
    {
public class Query : IRequest<List<UserExperienceDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserExperienceDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserExperienceDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserExperiences
                    .OrderBy(a => a.Experience.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.Experience.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(a => a.Experience.Date >= DateTime.Now);
                        break;
                }

                var experiences = queryable.ToList();
                var experiencesToReturn = new List<UserExperienceDto>();

                foreach (var activity in experiences)
                {
                    var userExperience = new UserExperienceDto
                    {
                        Id = activity.Experience.Id,
                        Title = activity.Experience.Title,
                        Category = activity.Experience.Category,
                        Date = activity.Experience.Date
                    };

                    experiencesToReturn.Add(userExperience);
                }

                return experiencesToReturn;
            }
        }        
    }
}