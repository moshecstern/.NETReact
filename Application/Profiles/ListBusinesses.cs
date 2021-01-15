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
    public class ListBusinesses
    {
        
public class Query : IRequest<List<UserBusinessDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserBusinessDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserBusinessDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserBusinesses
                    .OrderBy(a => a.Business.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.Business.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(a => a.Business.Date >= DateTime.Now);
                        break;
                }

                var businesses = queryable.ToList();
                var businessesToReturn = new List<UserBusinessDto>();

                foreach (var business in businesses)
                {
                    var userBusiness = new UserBusinessDto
                    {
                        Id = business.Business.Id,
                        Title = business.Business.Title,
                        Category = business.Business.Category,
                        Date = business.Business.Date
                    };

                    businessesToReturn.Add(userBusiness);
                }

                return businessesToReturn;
            }
        }        
    }
}