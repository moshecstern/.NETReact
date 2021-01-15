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
    public class ListCarts
    {
    public class Query : IRequest<List<UserCartDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserCartDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserCartDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserCarts
                    .OrderBy(a => a.Cart.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.Cart.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(a => a.Cart.Date >= DateTime.Now);
                        break;
                }

                var carts = queryable.ToList();
                var cartsToReturn = new List<UserCartDto>();

                foreach (var cart in carts)
                {
                    var userCart = new UserCartDto
                    {
                        Id = cart.Cart.Id,
                        Title = cart.Cart.Title,
                        Category = cart.Cart.Category,
                        Date = cart.Cart.Date
                    };

                    cartsToReturn.Add(userCart);
                }

                return cartsToReturn;
            }
        }           
    }
}