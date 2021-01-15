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
    public class ListWishlists
    {
        public class Query : IRequest<List<UserWishlistDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserWishlistDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserWishlistDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserWishlists
                    .OrderBy(a => a.Wishlist.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.Wishlist.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(a => a.Wishlist.Date >= DateTime.Now);
                        break;
                }

                var experiences = queryable.ToList();
                var experiencesToReturn = new List<UserWishlistDto>();

                foreach (var wishlist in experiences)
                {
                    var userWishlists = new UserWishlistDto
                    {
                        Id = wishlist.Wishlist.Id,
                        Title = wishlist.Wishlist.Title,
                        Category = wishlist.Wishlist.Category,
                        Date = wishlist.Wishlist.Date
                    };

                    experiencesToReturn.Add(userWishlists);
                }

                return experiencesToReturn;
            }
        }        
    }
}