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
    public class ListProducts
    {
        public class Query : IRequest<List<UserProductDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserProductDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserProductDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserProducts
                    .OrderBy(a => a.Product.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.Product.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    default:
                        queryable = queryable.Where(a => a.Product.Date >= DateTime.Now);
                        break;
                }

                var products = queryable.ToList();
                var productsToReturn = new List<UserProductDto>();

                foreach (var product in products)
                {
                    var userProduct = new UserProductDto
                    {
                        Id = product.Product.Id,
                        Title = product.Product.Title,
                        Category = product.Product.Category,
                        Date = product.Product.Date
                    };

                    productsToReturn.Add(userProduct);
                }

                return productsToReturn;
            }
        }       
    }
}